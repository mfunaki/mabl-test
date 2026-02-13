function mablJavaScriptStep(mablInputs, callback) {
    // 1. Selector for focusable elements
    const selector = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
    let elements = Array.from(document.querySelectorAll(selector))
        .filter(el => {
            // Exclude hidden elements or elements with hidden parents
            const style = window.getComputedStyle(el);
            return el.offsetWidth > 0 && el.offsetHeight > 0 && style.visibility !== 'hidden' && style.display !== 'none';
        });

    // 2. Sort by tabindex value (reproduce browser focus order)
    elements.sort((a, b) => {
        const aIndex = parseInt(a.getAttribute('tabindex')) || 0;
        const bIndex = parseInt(b.getAttribute('tabindex')) || 0;

        // Elements with tabindex > 0 have highest priority
        if (aIndex > 0 && bIndex > 0) return aIndex - bIndex;
        if (aIndex > 0) return -1;
        if (bIndex > 0) return 1;

        // Elements with tabindex = 0 or unspecified follow DOM order
        return 0;
    });

    // Helper function: Get identifiable name for an element
    function getElementLabel(el) {
        // 1. Use innerText if available
        if (el.innerText && el.innerText.trim()) {
            return el.innerText.trim().substring(0, 30);
        }
        // 2. Use placeholder if available
        if (el.placeholder) {
            return el.placeholder.substring(0, 30);
        }
        // 3. Use value attribute if available
        if (el.value) {
            return el.value.substring(0, 30);
        }
        // 4. Use id attribute if available
        if (el.id) {
            return `#${el.id}`;
        }
        // 5. Use name attribute if available
        if (el.name) {
            return `[name="${el.name}"]`;
        }
        // 6. Use associated label if available
        if (el.id) {
            const label = document.querySelector(`label[for="${el.id}"]`);
            if (label && label.innerText) {
                return label.innerText.trim();
            }
        }
        // 7. Fallback to tag name
        return el.tagName.toLowerCase();
    }

    let errors = [];
    const threshold = 5; // Threshold to tolerate slight pixel differences

    for (let i = 1; i < elements.length; i++) {
        const prev = elements[i - 1].getBoundingClientRect();
        const curr = elements[i].getBoundingClientRect();

        // Logic:
        // Top to bottom (error if curr.top < prev.top - threshold)
        // Same row, left to right (error if heights are similar and curr.left < prev.left - threshold)

        const isHigher = curr.top < (prev.top - threshold);
        const isSameRowAndLeft = Math.abs(curr.top - prev.top) <= threshold && curr.left < (prev.left - threshold);

        if (isHigher || isSameRowAndLeft) {
            const prevLabel = getElementLabel(elements[i - 1]);
            const currLabel = getElementLabel(elements[i]);
            const prevTabindex = elements[i - 1].getAttribute('tabindex') || 'none';
            const currTabindex = elements[i].getAttribute('tabindex') || 'none';

            errors.push(`Order issue: "${prevLabel}" (tabindex=${prevTabindex}) -> "${currLabel}" (tabindex=${currTabindex})`);
        }
    }

    if (errors.length > 0) {
        console.error("Focus order issues found:", errors);
        callback(false); // Test failed
    } else {
        console.log("Focus order is correct!");
        callback(true); // Test passed
    }
}
