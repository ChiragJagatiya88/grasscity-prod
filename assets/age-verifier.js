if (!customElements.get('age-verifier')) {
  const ModalBase = customElements.get('basic-modal') || customElements.get('modal-component');
  if (!ModalBase) {
    console.warn('Age verifier: theme modal component not found.');
  }
  customElements.define(
    'age-verifier',
    class AgeVerifier extends (ModalBase || HTMLElement) {
      constructor() {
        super();

        this.init();
      }

      get overlay() {
        return (this._overlay = this._overlay || this.querySelector('.overlay') || this.querySelector('.fixed-overlay'));
      }

      get shouldLock() {
        return true;
      }

      get testMode() {
        return this.getAttribute('data-test-mode') === 'true';
      }

      get delay() {
        return this.hasAttribute('data-delay') ? parseInt(this.getAttribute('data-delay'), 10) : 1;
      }

      get expiry() {
        return this.hasAttribute('data-expiry') ? parseInt(this.getAttribute('data-expiry')) : 30;
      }

      get cookieName() {
        return 'age_verified';
      }

      init() {
        if (!ModalBase) return;
        if (this.testMode || !this.getCookie(this.cookieName)) {
          this.load(this.delay);
        }
      }

      connectedCallback() {
        if (super.connectedCallback) super.connectedCallback();
        const yesBtn = this.querySelector('.age-verifier__btn--yes');
        if (yesBtn) {
          yesBtn.addEventListener('click', () => this.onConfirm());
        }
      }

      onConfirm() {
        if (this.testMode) return;
        this.setCookie(this.cookieName, this.expiry);
      }

      load(delay) {
        if (typeof Shopify !== 'undefined' && Shopify.designMode) return;

        setTimeout(() => this.show(), delay * 1000);
      }

      afterShow() {
        if (super.afterShow) super.afterShow();
        this.classList.add('show-image');
      }

      afterHide() {
        if (super.afterHide) super.afterHide();
        this.classList.remove('show-image');
        if (this.testMode) {
          this.removeCookie(this.cookieName);
        }
      }

      getCookie(name) {
        const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
        return match ? match[2] : null;
      }

      setCookie(name, expiry) {
        document.cookie = `${name}=true; max-age=${(expiry * 24 * 60 * 60)}; path=/`;
      }

      removeCookie(name) {
        document.cookie = `${name}=; max-age=0; path=/`;
      }
    }
  );
}
