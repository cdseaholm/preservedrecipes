export default function AboutSection({ id }: { id: string }) {
    return (
        <div className="flex flex-row items-center justify-center w-11/12 xl:h-2/3 h-full sm:h-4/5 xl:px-12 max-sm:m-4 xl:py-32 xl:m-5 m-2 p-12 bg-altBack/80
        relative 
        overflow-hidden rounded-md" id={id}>
            <div className="flex flex-col justify-center items-center text-center space-y-5 text-base md:text-xl text-darkText">
                <p>
                    {`Preserved Recipes is born from the idea that no family secrets should be left behind. This is much more than simply a recipe web application, but a place for families, individuals, and communities to come together and share their recipes. That does not mean you cannot keep your recipes secret. Preserved recipes has many ways of picking and choosing who gets to see the recipe. Even if it is everyone, or no one.`}
                </p>
                <p>
                    {`Furthermore, no cook, baker, or individual interested in food in any capacity, should be confused on where they can go to find their family's recipes, find communities interested in sharing recipes, or even looking for help on improving a recipe.`}
                </p>
            </div>
        </div>
    )
}