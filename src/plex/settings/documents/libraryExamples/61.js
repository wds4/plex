export const cgExample_61 = `const options = {
    cgidType: slug,
    orderBy: 'desc'
}
const aCgids = await cg.cgids.ls(options)
console.log(JSON.stringify(aCgids,null,4))
/*
zoo
wordTypesForOrganisms
wordTypesForGrapevine
wordTypesForConceptGraphs
wordTypeFor_wordUpdateProposal
...
*/

const options = {
    cgidType: user-name
}
const aCgids = await cg.cgids.ls(options)
console.log(JSON.stringify(aCgids,null,4))
// Alice, Bob, Charlie, ...

const options = {
}
const oCgids = await cg.cgids.ls(options)
console.log(JSON.stringify(oCgids,null,4))
/*
    {
        widgets: {
            slug: [...],
            name: [...],
            title: [...]
        }
        user: {
            name: [Alice,Bob,Charlie, ... ]
        },
        words: {
            ipns: [abc123,dfg274,...]
        }
    }
*/
`
