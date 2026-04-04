'use client'

import ListWrapper from "@/components/wrappers/list-wrapper";
import { RecipeFormType } from "@/models/types/recipes/review";
import { Fieldset } from "@mantine/core";

export default function RecipePanelReviews({ recipeForm }: { recipeForm: RecipeFormType }) {

    //will need to add filtering logic to comments/ratings
    

    return (
        <Fieldset variant="filled" legend={<p className="text-base md:text-lg font-semibold mt-12">Reviews</p>}>
            <ListWrapper searchBar={false} numberOfPages={1} isPending={false} currentPage={1} editButtons={undefined}>
                {recipeForm.getValues().reviews && recipeForm.getValues().reviews.length > 0 ? (
                    recipeForm.getValues().reviews.map((review, index) => (
                        <div className="w-full p-4 flex flex-col justify-start items-start border-b border-accent/30" key={index}>
                            <div className="flex flex-row items-center justify-between w-full mb-2">
                                <h3 className="text-md font-semibold">{review.authorFirstName ? review.authorFirstName : 'Anonymous'}</h3>
                                <span>{review.rating ? `Rating: ${review.rating}/5` : 'No Rating'}</span>
                            </div>
                            <p className="text-sm sm:text-base">{review.comment ? review.comment : 'No Comment'}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm sm:text-base">No reviews available for this recipe.</p>
                )}
            </ListWrapper>
        </Fieldset>
    );
}