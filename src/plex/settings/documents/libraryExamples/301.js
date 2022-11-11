export const cgExample_301 = `const options = {
    inputCgidType: "word-slug",
    outputCgidType: "user-title"
}
const set = "supersetFor_user"
const aResult = await cg.specificInstances.ls(set, options)
console.log(JSON.stringify(aResult))
// ["Alice","Bob"]
`
