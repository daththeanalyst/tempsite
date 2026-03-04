import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(slug);
}

export function sanitizeHtml(html: string): string {
  // Strip script tags and their contents
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Strip on* event attributes
  clean = clean.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/\s+on\w+\s*=\s*\S+/gi, '');
  // Strip javascript: URLs
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  clean = clean.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');
  return clean;
}

export function injectWatermark(html: string): string {
  const watermark = `
    <div style="position:fixed;bottom:12px;right:12px;z-index:99999;background:rgba(0,0,0,0.7);color:white;padding:6px 14px;border-radius:20px;font-size:12px;font-family:system-ui,sans-serif;pointer-events:auto;backdrop-filter:blur(4px);">
      <a href="https://tempsite.app" target="_blank" style="color:white;text-decoration:none;">Made with ✨ Tempsite</a>
    </div>`;
  return html.replace('</body>', `${watermark}</body>`);
}

export function injectEditorScript(html: string): string {
  const script = `
    <script>
    (function() {
      let activeElement = null;

      document.addEventListener('click', function(e) {
        const editable = ['P','H1','H2','H3','H4','H5','H6','SPAN','A','LI','TD','TH','BUTTON','LABEL','BLOCKQUOTE','FIGCAPTION','DIV'];
        let target = e.target;

        // Don't edit if it's a container with many children
        if (target.children.length > 3 && !['P','H1','H2','H3','H4','H5','H6','SPAN','A','LABEL','BLOCKQUOTE'].includes(target.tagName)) return;

        if (!editable.includes(target.tagName)) {
          // Try parent
          if (target.parentElement && editable.includes(target.parentElement.tagName)) {
            target = target.parentElement;
          } else {
            return;
          }
        }

        e.preventDefault();
        e.stopPropagation();

        // Deactivate previous
        if (activeElement && activeElement !== target) {
          activeElement.contentEditable = 'false';
          activeElement.style.outline = '';
          activeElement.style.outlineOffset = '';
        }

        activeElement = target;
        target.contentEditable = 'true';
        target.style.outline = '2px dashed #3b82f6';
        target.style.outlineOffset = '2px';
        target.focus();

        // Send styles to parent
        const computed = window.getComputedStyle(target);
        window.parent.postMessage({
          type: 'element-selected',
          styles: {
            fontFamily: computed.fontFamily,
            fontSize: computed.fontSize,
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontWeight: computed.fontWeight,
            fontStyle: computed.fontStyle,
            textDecoration: computed.textDecoration,
            textAlign: computed.textAlign,
          },
          text: target.textContent,
          tagName: target.tagName,
        }, '*');
      });

      document.addEventListener('focusout', function(e) {
        if (activeElement) {
          activeElement.contentEditable = 'false';
          activeElement.style.outline = '';
          activeElement.style.outlineOffset = '';

          // Send updated HTML to parent
          window.parent.postMessage({
            type: 'html-updated',
            html: document.documentElement.outerHTML,
          }, '*');
          activeElement = null;

          // Hide toolbar
          window.parent.postMessage({ type: 'element-deselected' }, '*');
        }
      });

      // Listen for style changes from parent
      window.addEventListener('message', function(e) {
        if (e.data.type === 'apply-style' && activeElement) {
          activeElement.style[e.data.property] = e.data.value;

          // Send updated HTML
          window.parent.postMessage({
            type: 'html-updated',
            html: document.documentElement.outerHTML,
          }, '*');

          // Send updated styles
          const computed = window.getComputedStyle(activeElement);
          window.parent.postMessage({
            type: 'element-selected',
            styles: {
              fontFamily: computed.fontFamily,
              fontSize: computed.fontSize,
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              fontWeight: computed.fontWeight,
              fontStyle: computed.fontStyle,
              textDecoration: computed.textDecoration,
              textAlign: computed.textAlign,
            },
            text: activeElement.textContent,
            tagName: activeElement.tagName,
          }, '*');
        }
      });

      // Prevent navigation
      document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
          e.preventDefault();
        }
      }, true);
    })();
    </script>`;
  return html.replace('</body>', `${script}</body>`);
}

export function generateSlug(): string {
  return Math.random().toString(36).substring(2, 10);
}
