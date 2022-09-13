
pageViews['about-contents'] = conceptGraphMasthead + `
<div class=h2>About the Concept Graph</div>
<style>
.coolPrinciple {
    display:inline-block;
    background-color:orange;
    border:2px solid brown;
    border-radius:8px;
    padding:5px;
    margin:2px;
    width:80%;
}
</style>
<h4>the Fundamental Principle of the Concept Graph:</h4>
<pre class=coolPrinciple >
Any self-contained piece of software should have a <b>formal method</b> to look up the <b>format</b> of any given file .
</pre>
<div class=coolPrinciple >
Any self-contained piece of software should have a single, simple and <b>explicit method</b> to list and validate the set of all <b>constraints</b> (i.e. file formatting constraints) imposed upon any given file .
</div>
<li>Internal consistency: every file validates properly
<br>
The formal method should be simple yet generically applicable, like a law of physics. In practice: the method corresponds to a path that connects file A to file B,
where file A provides instructions to the interpretation (i.e. the expected format) of file B. Formal specification of path structure is like a law of physics.
<br>
The principle is a more general statement than it may appear at first glance.
Format means: <b>how do you interpret the contents of any given file</b>;
interpret means: how do you (the function used to) translate, or map, any given file A to file B.
So we're looking for a simple statement that tells how to transform any given input into any output.
<br>
Multiple benefits of following this design principle, described herein.
<br>
<h4>the Fundamental Principle of the Concept Graph, expanded:</h4>
<div class=coolPrinciple >
Within any self-contained computer, such as a software package or application, given any file of interest, there should be one, or at most a small number,
of internally consistent, formalized, relatively simple, generally applicable (i.e. to as wide a subset of files within the software package as possible) methods to look up that file's format. Formal enough so that:<br>
0. it can be used internally within the app at runtime<br>
1. proper formatting of all files can be verified at compilation, startup, or at other appropriate times (see below)<br>
2. UI can be built so that users (not necessarily with experience as developers) can explore and better understand various design or formatting decisions,
including the solution space of all possible conceivable decisions (i.e., options considered but not chosen)<br>
3. UI can be built to make it easy for (non-dev) users to submit/propose changes to formatting and for that proposal to be packaged so that it is explicit enough for meaningful evaluation:<br>
<li> by other end-users (to evaluate desirability of the proposed change)
<li> by software and/or other developers (to evaluate compatibility within the setting of any given software package)
<li> by above-mentioned compliation software packages that can 1. determine interoperability with other changes or packages and 2. create compatibility wherever possible
Users can submit changes already within the solution space that has already been proposed, or may wish to expand the solution space. As we will see,
under a sufficiently complete implementation of the principle, the latter becomes a subset of the former. Examples of all this below.
</div>
<br>
Note that the Principle can be applied in full or in part to any given piece of software. In part, meaning that it can be true of some files but not all.
Thus any given piece of software can be transformed bit by bit by applying the Principle to selected subsets of files, one subset at a time.
<h4>Primary purpose: to crowdsource decisions in a web3.0 environ.</h4>
<h4>Secondary purpose: to allow greater flexibility in open source code</h4>
Of interest: any formatting decision that normally would be made by core developers of an open source project but might benefit from crowdsourced input.
<br>
Format: For our purposes, by format, think: JSON format of various files including data files and template files.
But these ideas can be applied to any formatting decisions that must be made, such as:
<li>encryption algorithms
<li>compute language (javascript, python, php, etc)
<li>language (English, German, etc)
<li>character encoding (ASCII, Unicode, HTML, etc)
Eventually, every file and formatting decision will fit into the 'of interest' category.
<br>
Some implications of Principle 1:
<li>It ensures that any changes must be up to date. Contrast this with spec sheets, which are often not well maintained.
<li>Any change or set of changes can be tested automatically for compatibility. IOW you can propose a change and know automatically whether it is a breaking change or not via compliation step.
<li>Enhanced variability / flexibility of open source code. It makes possible that not every user must accept exactly the same grand set of design decisions.
Analogous to the fact that people can choose diverget dialects while still maintaining the ability to have some meaningful communication.
Interoperability degrades gracefully with divergence [of code or other formatting decisions] rather than breaking completely.
<li>It forces (or at least provides the opportunity for) the developer to consider and formalize the widest conceivable space of design options / formatting decisions.
<h4>Other considerations</h4>
Does the brain obey the principle of the concept graph? Probably yeah.
`;
