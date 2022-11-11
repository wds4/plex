export const cgExample_62 = `const title = await cg.cgid.transform("conceptFor_user", {outputCgidType:"user-title"})
console.log(title)
// User

const title = await cg.cgid.transform("conceptFor_user", {outputCgidType:"_MAIN_CONCEPT_-title"})
console.log(title)
// User

const oWord = await cg.cgid.transform("conceptFor_user", {outputCgidType:"word"})
console.log(JSON.stringify(oWord,null,4))
/*
{
    wordData: {
        slug: conceptFor_user
    },
    conceptData: {
        slug: user
    }
    ...
}
*/
`
