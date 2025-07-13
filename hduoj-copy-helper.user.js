// ==UserScript==
// @name         HDU OJ Copy Helper
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  在 HDU OJ 比赛页面的所有题目内容文本框右上角添加复制按钮
// @author       0WD0
// @homepage     https://github.com/0WD0/hduoj-copy-helper
// @match        http*://acm.hdu.edu.cn/contest/problem*
// @grant        GM_setClipboard
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/turndown/7.2.0/turndown.min.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .problem-detail-block {
            position: relative;
        }
        
        .hdu-copy-button {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            background: #007bff;
            border: none;
            border-radius: 4px;
            color: white;
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        
        .hdu-copy-button:hover {
            opacity: 1;
            background: #0056b3;
        }
        
        .hdu-copy-button.copied {
            background: #28a745;
        }
        
        .hdu-copy-button svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }
    `;
    document.head.appendChild(style);

    // 复制图标SVG
    const copyIconSVG = `
        <svg viewBox="0 0 12 12">
            <path d="M2.625 0.625H7.68892C8.16883 0.626367 8.62869 0.817615 8.96804 1.15696C9.30738 1.49631 9.49863 1.95617 9.5 2.43608L9.50003 2.44792L9.49881 2.5H9.53906C10.553 2.5 11.375 3.32198 11.375 4.33594V9.53906C11.375 10.553 10.553 11.375 9.53906 11.375H4.33594C3.32198 11.375 2.5 10.553 2.5 9.53906V9.5H2.4375L2.43608 9.5C1.95617 9.49863 1.49631 9.30738 1.15696 8.96804C0.817615 8.62869 0.626367 8.16883 0.625002 7.68892L0.625 7.6875V2.62352C0.626565 2.09396 0.837628 1.58654 1.21208 1.21208C1.58654 0.837628 2.09396 0.626567 2.62352 0.625002L2.625 0.625ZM3.5 9.53906C3.5 10.0007 3.87426 10.375 4.33594 10.375H9.53906C10.0007 10.375 10.375 10.0007 10.375 9.53906V4.33594C10.375 3.87426 10.0007 3.5 9.53906 3.5H8.98998C8.98898 3.5 8.98799 3.5 8.98699 3.5H4.33594C3.87426 3.5 3.5 3.87426 3.5 4.33594V9.53906ZM8.49859 2.5H4.33594C3.32198 2.5 2.5 3.32198 2.5 4.33594V8.5H2.43833C2.22287 8.49923 2.01644 8.4133 1.86407 8.26093C1.71171 8.10857 1.62578 7.90216 1.625 7.68671V2.62582C1.62596 2.36069 1.7317 2.10668 1.91919 1.91919C2.10668 1.7317 2.36069 1.62596 2.62582 1.625H7.68671C7.90216 1.62578 8.10857 1.71171 8.26093 1.86407C8.41221 2.01535 8.498 2.21991 8.49997 2.4337L8.49859 2.5Z"/>
        </svg>
    `;

    // 创建 TurndownService 实例
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    });
    
    // 创建复制按钮
    function createCopyButton(element) {
        const button = document.createElement('button');
        button.className = 'hdu-copy-button';
        button.innerHTML = copyIconSVG;
        button.title = '复制内容';
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                let textContent;
                
                // 如果有保存的原始内容，使用原始内容
                if (originalContentMap.has(element)) {
                    textContent = originalContentMap.get(element);
                    console.log('使用保存的原始内容:', textContent);
                } else if (element.classList.contains('marked')) {
                    // 对于标记过的内容，尝试使用turndown
                    const clonedElement = element.cloneNode(true);
                    
                    // 移除KaTeX元素并替换为原始LaTeX
                    clonedElement.querySelectorAll('.katex').forEach(katex => {
                        const original = katex.getAttribute('data-original') || 
                                       katex.getAttribute('title') ||
                                       katex.textContent;
                        katex.outerHTML = original;
                    });
                    
                    textContent = turndownService.turndown(clonedElement.innerHTML);
                    console.log('使用turndown转换:', textContent);
                } else {
                    // 对于普通内容，直接获取文本
                    textContent = element.textContent.trim();
                    console.log('使用普通文本:', textContent);
                }
                
                // 使用 GM_setClipboard
                GM_setClipboard(textContent);
                
                button.classList.add('copied');
                button.title = '已复制!';
                
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.title = '复制内容';
                }, 1000);
                
            } catch (err) {
                console.error('复制失败:', err);
            }
        });
        
        return button;
    }

    // 保存原始内容的Map
    const originalContentMap = new Map();
    
    // 在页面渲染之前保存原始内容
    function saveOriginalContent() {
        document.querySelectorAll('.problem-detail-value.marked').forEach(element => {
            // 保存原始innerHTML作为markdown源码
            originalContentMap.set(element, element.innerHTML.trim());
        });
    }
    
    // 为题目内容块添加复制按钮
    function addCopyButtons() {
        // 查找所有题目内容块
        const contentBlocks = document.querySelectorAll('.problem-detail-block:not(.block-sample-input)');
        
        contentBlocks.forEach(block => {
            // 检查是否已经添加过复制按钮
            if (block.querySelector('.hdu-copy-button')) {
                return;
            }
            
            const valueElement = block.querySelector('.problem-detail-value');
            if (valueElement) {
                const copyButton = createCopyButton(valueElement);
                block.appendChild(copyButton);
            }
        });
        
        // 特殊处理Sample Input（如果原本没有复制按钮）
        const sampleInputBlock = document.querySelector('.block-sample-input');
        if (sampleInputBlock && !sampleInputBlock.querySelector('.copy-button') && !sampleInputBlock.querySelector('.hdu-copy-button')) {
            const valueElement = sampleInputBlock.querySelector('.problem-detail-value');
            if (valueElement) {
                const copyButton = createCopyButton(valueElement);
                sampleInputBlock.appendChild(copyButton);
            }
        }
    }

    // 页面加载完成后的处理
    function init() {
        // 先保存原始内容，再添加复制按钮
        saveOriginalContent();
        // 延迟一下，等待可能的数学公式渲染完成后再次添加按钮
        setTimeout(() => {
            addCopyButtons();
        }, 500);
        addCopyButtons();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听动态内容变化（如果页面有AJAX加载内容）
    const observer = new MutationObserver(() => {
        addCopyButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
