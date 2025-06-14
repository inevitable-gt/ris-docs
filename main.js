document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector('.search-input');
  const mainContent = document.querySelector('.main-content');

  // Remove previous highlights
  function removeHighlights() {
    const highlights = mainContent.querySelectorAll('mark.search-highlight');
    highlights.forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  // Highlight all matches in the main content
  function highlightMatches(query) {
    if (!query) return;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const treeWalker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, null, false);

    let node;
    while ((node = treeWalker.nextNode())) {
      if (node.parentNode && node.nodeValue.trim() && regex.test(node.nodeValue)) {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(regex, '<mark class="search-highlight">$1</mark>');
        node.parentNode.replaceChild(span, node);
      }
    }
  }

  // Scroll to first highlight
  function scrollToFirstHighlight() {
    const first = mainContent.querySelector('mark.search-highlight');
    if (first) {
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  searchInput.addEventListener('input', function () {
    removeHighlights();
    const query = searchInput.value.trim();
    if (!query) return;
    highlightMatches(query);
    scrollToFirstHighlight();
  });
});