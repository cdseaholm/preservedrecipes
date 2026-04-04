'use client'

import { useDataStore } from "@/context/dataStore";
import { useModalStore } from "@/context/modalStore";
import { useUserStore } from "@/context/userStore";
import { IPost, PostFormType } from "@/models/types/misc/post"
import { IRecipe, RecipeFormContextType } from "@/models/types/recipes/recipe";
import { Combobox, InputBase, Overlay, ScrollArea, Select, Textarea, TextInput, useCombobox } from "@mantine/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreatePostForm({
    postForm,
    userRecipes,
    recipeForPost,
    handleCreatePost
}: {
    postForm: PostFormType,
    userRecipes: IRecipe[],
    recipeForPost: IRecipe | null,
    handleCreatePost: () => void
}) {

    const userInfo = useUserStore(state => state.userInfo);
    const [visible, setVisible] = useState<boolean>(false);
    const setRecipeForPostAndPostBackup = useDataStore(state => state.setRecipeForPostAndPostBackup);
    const setOpenRecipeForm = useModalStore(state => state.setOpenRecipeForm);
    const setOpenPostModal = useModalStore(state => state.setOpenPostModal);
    const combobox = useCombobox({
        onDropdownOpen: () => setVisible(true),
        onDropdownClose: () => {
            combobox.resetSelectedOption();
            setVisible(false);
        },
    });

    // ✅ Initialize from form values
    const initialType = postForm.getValues().type;
    console.log("Initial post type from form:", initialType);
    const initialContent = postForm.getValues().content || [];

    const [search, setSearch] = useState(() => {
        // If form has a recipe ID in content, find and display its name
        if (initialType === 'recipe' && Array.isArray(initialContent) && initialContent.length > 0) {
            const recipeId = initialContent[0];
            const recipe = userRecipes.find(r => r._id === recipeId);
            return recipe?.name || '';
        }
        return '';
    });

    const [value, setValue] = useState<IRecipe | null>(() => {
        if (initialType === 'recipe' && Array.isArray(initialContent) && initialContent.length > 0) {
            return userRecipes.find(r => r._id === initialContent[0]) || null;
        }
        return null;
    });

    const [currentType, setCurrentType] = useState<string | null>(initialType);
    const [data, setData] = useState<IRecipe[]>(userRecipes);

    const exactOptionMatch = data.some((item) => item.name === search);
    const filteredOptions = exactOptionMatch
        ? data
        : data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase().trim()));

    const options = filteredOptions.map((recipe) => (
        <Combobox.Option value={recipe._id} key={recipe._id} w={'100%'}>
            {recipe.name}
        </Combobox.Option>
    ));

    // ✅ Update when recipeForPost changes (coming back from recipe creation)
    useEffect(() => {
        if (recipeForPost) {
            setValue(recipeForPost);
            setSearch(recipeForPost.name);
            setCurrentType('recipe');
            if (!data.some(r => r._id === recipeForPost._id)) {
                setData([recipeForPost, ...data]);
            }
            postForm.setFieldValue('type', 'recipe');
            postForm.setFieldValue('content', [recipeForPost._id]);
        }
    }, [recipeForPost]);

    return (
        <form className="flex flex-col justify-start items-center h-content w-full space-y-4" onSubmit={postForm.onSubmit(handleCreatePost)}>
            {visible && <Overlay color="#000" backgroundOpacity={0.20} />}
            <Select
                w={'100%'}
                label="Post Type"
                placeholder="Select post type"
                data={[
                    { value: 'recipe', label: 'Recipe' },
                    { value: 'text', label: 'Text' },
                    { value: 'image', label: 'Image', disabled: true },
                    { value: 'video', label: 'Video', disabled: true },
                    { value: 'link', label: 'Link', disabled: true },
                    { value: 'other', label: 'Other', disabled: true },
                ]}
                key={'post-type-select'}
                id="post-type-select"
                {...postForm.getInputProps('type')}
                onChange={(val) => {
                    const textSpec = val as 'text' | 'recipe';
                    if (!['text', 'recipe', null].includes(textSpec || null)) {
                        toast.error('Invalid post type selected');
                        return;
                    } else {
                        postForm.clearErrors();
                        postForm.resetDirty();
                        postForm.resetTouched();
                        if (currentType === textSpec) return; // No change
                        postForm.setFieldValue('type', textSpec || 'text');
                        setCurrentType(textSpec || 'text');
                        // Clear content when switching types
                        postForm.setFieldValue('content', []);
                        // Reset recipe search
                        if (textSpec !== 'recipe') {
                            setSearch('');
                            setValue(null);
                        }
                    }
                }}
            />
            <TextInput
                w={'100%'}
                id="post-title-input"
                key={'post-title-input'}
                label="Post Title"
                placeholder="Your post's title"
                {...postForm.getInputProps('name')}
            />
            {currentType === 'text' ? (
                <Textarea
                    w={'100%'}
                    id="post-content-textarea"
                    key={'post-content-textarea'}
                    label="Post Content"
                    placeholder="Your post content..."
                    {...postForm.getInputProps('content')}
                    minRows={6}
                    autosize={true}
                />
            ) : currentType === 'recipe' ? (
                <Combobox
                    store={combobox}
                    withinPortal={false}
                    onOptionSubmit={(val) => {
                        setValue(data.find(r => r._id === val) || null);
                        setSearch(data.find(r => r._id === val)?.name || '');
                        postForm.setFieldValue('content', [val]);
                        combobox.closeDropdown();
                    }}
                >
                    <Combobox.Target>
                        <InputBase
                            w={'100%'}
                            id="recipe-combobox-input"
                            key={'recipe-combobox-input'}
                            label="Select Recipe"
                            rightSection={<Combobox.Chevron />}
                            value={search}
                            onChange={(event) => {
                                combobox.openDropdown();
                                combobox.updateSelectedOptionIndex();
                                setSearch(event.currentTarget.value);
                            }}
                            onClick={() => combobox.openDropdown()}
                            onFocus={() => combobox.openDropdown()}
                            onBlur={() => {
                                combobox.closeDropdown();
                                setSearch(value ? data.find(r => r === value)?.name || '' : '');
                            }}
                            placeholder="Search your recipes or create a new one"
                            rightSectionPointerEvents="none"
                        />
                    </Combobox.Target>

                    <Combobox.Dropdown style={{
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                    }} px={'xs'} py={'sm'}>
                        <Combobox.Options style={{
                            maxHeight: '200px',
                            overflowY: 'hidden',
                            padding: '4px',
                            borderRadius: '8px',
                            border: '1px solid #7b7e83ff',
                        }}>
                            <button
                                type="button"
                                className="flex flex-row items-center justify-center text-blue-500 font-medium cursor-pointer px-3 py-2 hover:bg-blue-100 rounded-md w-full mb-2 border-b border-gray-200"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setValue(null);
                                    setSearch('');
                                    postForm.setFieldValue('content', []);
                                    setRecipeForPostAndPostBackup({
                                        recipe: null,
                                        backupPost: postForm.getValues() as IPost
                                    });
                                    setOpenRecipeForm({
                                        type: "create",
                                        recipe: null,
                                        from: "post",
                                        fromId: userInfo?._id || '',
                                    } as RecipeFormContextType);
                                    combobox.closeDropdown();
                                    setOpenPostModal(null);
                                }}
                            >
                                <span className="mr-2">+</span>
                                Create New Recipe
                            </button>
                            <ScrollArea.Autosize mah={200} type="scroll">
                                {options.length > 0 && (
                                    <Combobox.Option value="" disabled>
                                        <div className="border-t border-gray-200 my-1" />
                                    </Combobox.Option>
                                )}
                                {options.length > 0 ? (
                                    options
                                ) : (
                                    <Combobox.Empty>No recipes found - Create one</Combobox.Empty>
                                )}
                            </ScrollArea.Autosize>
                        </Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>
            ) : null}
            <button type="submit" className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-200 transition-colors cursor-pointer mt-[16px]">
                Create Post
            </button>
        </form>
    )
}