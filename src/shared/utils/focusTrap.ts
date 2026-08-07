export class FocusTrap {
  private activeElementBeforeOpen: HTMLElement | null = null;

  activate(container: HTMLElement): () => void {
    this.activeElementBeforeOpen = document.activeElement as HTMLElement;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
    );
    
    if (focusableElements.length === 0) return () => {};

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    // Set initial focus to the first element
    first.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      this.activeElementBeforeOpen?.focus();
    };
  }
}
