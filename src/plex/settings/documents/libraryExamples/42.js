export const cgExample_42 = `const oWord = await cg.mfs.get("/grapevineData/userProfileData/myProfile.txt")
console.log(JSON.stringify(oWord))
/*
{
    ...
}
*/

const sWord = await cg.mfs.get("/grapevineData/userProfileData/myProfile.txt",{convertToObject: false})
console.log(sWord)
/*
{
    ...
}
*/
`
