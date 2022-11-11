export const cgExample_63 = `const cgid = "user"
const cgidType = await cg.cgid.type.resolve(cgid, {})
console.log(cgidType)
// concept-slug

const cgid = ["user","post","conceptFor_user"]
const cgidType = await cg.cgid.type.resolve(cgid, {})
console.log(cgidType)
// [ concept-slug, concept-slug, slug]

const cgid = "user"
const cgidType = await cg.cgid.type.resolve(cgid, { verbose:true })
console.log(cgidType)
/*
{
    command: "const cgidType = await cg.cgid.type.resolve('user', { verbose: true })"
    conceptGraph: "abcde12345",
    output: "concept-slug",
    errors: false
}
 */
`
