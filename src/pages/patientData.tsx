import prisma from "./database/db";

export async function PatientData() {
    const recipes = await prisma.recipe.findMany();

    // Convert Date objects to ISO strings for serialization
    const serializedRecipes = recipes.map(recipe => ({
        ...recipe,
        createdAt: recipe.createdAt.toISOString(),
        updatedAt: recipe.updatedAt.toISOString()
    }));

    return <pre>{JSON.stringify(serializedRecipes, null, 2)}</pre>;
}
