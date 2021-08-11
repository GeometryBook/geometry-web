import Quill from 'quill';
// Import parchment and delta for creating custom module
// import Parchment from 'parchment';
const Parchment = Quill.imports.parchment;
// const Delta = Quill.imports.delta;

// Extend the embed
class Mathjax extends Parchment.Embed {

  // Create node
  static create(value) {
    const node = super.create(value);
    if (typeof value === 'string') {
      node.innerHTML = this.tex2svg(value);
      node.contentEditable = 'false';
      node.setAttribute('data-value', value);
    }
    return node;
  }

  // Return the attribute value (probably for Delta)
  static value(domNode) {
    return domNode.getAttribute('data-value');
  }

  // Manually render a MathJax equation until version 3.0.2 is not released
  static tex2svg(latex) {
    // Create a hidden node and render the formula inside
    let MathJaxNode = document.createElement("DIV");
    MathJaxNode.style.visibility = "hidden";
    MathJaxNode.innerHTML = '\\(' + latex + '\\)';
		document.body.appendChild(MathJaxNode);
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, MathJaxNode]);
    let svg = MathJaxNode.innerHTML;
    document.body.removeChild(MathJaxNode);
    return svg;
  }
  /*
  //  Never called ? See : https://stackoverflow.com/questions/60935100/html-method-in-quill-formula-js
  html() {
      const { mathjax } = this.value();
      return `<span>${mathjax}</span>`;
    }
   */
}

// Set module properties
Mathjax.blotName = 'mathjax';
Mathjax.className = 'ql-mj';
Mathjax.tagName = 'SPAN';

export default Mathjax
