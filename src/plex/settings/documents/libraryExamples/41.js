export const cgExample_41 = `const aResult = await cg.mfs.ls()
console.log(JSON.stringify(aResult))
/*
[
    "/grapevineData/...",
    "/plex/...",
    ...
]
*/
const aResult = await cg.mfs.ls({substring:"/grapevineData/"})
console.log(JSON.stringify(aResult))
/*
[
    "/grapevineData/..."
]
*/
`
