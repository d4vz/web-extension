/**
 * Retrieves the container parent element of a given span element.
 *
 * @param {HTMLSpanElement} span - The span element for which to find the container parent.
 * @returns {HTMLElement} - The container parent element.
 */
const getContainerParent = (span) => {
  return span.parentElement.parentElement.parentElement.parentNode.parentNode.parentNode.parentNode.parentNode;
}


module.exports = {
  getContainerParent,
};