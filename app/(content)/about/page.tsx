export default function Page() {
    return (
        <div className="h-full w-full p-8">
            <div className="flex flex-col justify-center items-center w-full h-full bg-altBack/80 rounded-md">
                <div className="flex flex-col justify-center items-center text-center space-y-5 text-base md:text-xl text-darkText">
                    <p>
                        {`Preserved Recipes is born from the idea that no family secrets should be left behind. This is much more than simply a recipe web application, but a place for families, individuals, and communities to come together and share their recipes. That does not mean you cannot keep your recipes secret. Preserved recipes has many ways of picking and choosing who gets to see the recipe. Even if it is everyone, or no one.`}
                    </p>
                    <p>
                        {`Furthermore, no cook, baker, or individual interested in food in any capacity, should be confused on where they can go to find their family's recipes, find communities interested in sharing recipes, or even looking for help on improving a recipe.`}
                    </p>
                </div>
            </div>
        </div>
    )
}