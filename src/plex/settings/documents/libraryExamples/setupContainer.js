export const setupContainer = `import * as ConceptGraphLib from '../../lib/ipfs/conceptGraphLib.js'
import * as GrapevineLib from '../../lib/ipfs/grapevineLib.js'

const cg = ConceptGraphLib.cg;
const gv = GrapevineLib.gr;

var cgid = "conceptFor_user";
var cgid_ipns = await cg.resolve(cgid);
console.log("cgid_ipns: "+cgid_ipns)

var cgid = "abc123";
var oProfile = await gr.user.profile(cgid,{inputCidType:'ipns'});
console.log("username: "+oProfile.username)
`
