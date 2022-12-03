import { useState, useEffect } from "react";

const printContainerId = "UNIQUE_PRINT_CONTAINER";

/**
 * @name useWindowPrint
 * @description 自定义的打印hook，用于实现页面的打印
 * 
 * @param {Object}
 * - @param {String} contentId 打印区域的id
 * - @param {String} margin 打印时的纸张边距，例如：5mm，代表边距为5mm，语法与CSS的margin一致，支持分别设置四个方向的边距
 * - @param {Number} zoom 打印时的页面缩放比例，例如：0.7，代表页面缩放为70%，可以用于横向滚动表格内容排版的美化
 * - @param {Function} onBeforePrint 打印之前的回调，可以进行自身页面上的状态更新，如展开树形表格、处理元素的展示效果等
 * - @param {Function} onBeforePrintContent 打印DOM结构之前的回调，可以依据参数，来自行调整DOM结构
 * - @param {Function} onAfterPrint 打印之后的回调，可以进行打印之后的一些操作
 * 
 * @returns {Array}
 * - @param {Boolean} isPrint
 * - @param {Function} beginPrint
 * 
 * 注意：
 * 1、如果只是需要一个状态来控制页面上的元素，在打印和非打印状态下的显示隐藏，可以直接使用解构出的isPrint，无需自己维护状态
 * 2、一般情况下，onBeforePrintContent和onAfterPrint是用不到的，除非有相关特殊的业务处理
 * 3、margin的默认值为5mm，即四个方向上的边距都为5mm，也可以自己进行设定四个方向上的边距，语法与CSS的margin一致，如：'5mm 0mm'
 * 4、zoom选项为可选项，代表打印时，打印内容的缩放比例，可以实现打印内容的放大和缩小
 *    4.1 火狐浏览器不支持此样式，请根据项目实际情况选用
 *    4.2 一般情况下，不需要进行页面的缩放，除非涉及到列很多的横向滚动表格，不缩放的话，表格的内容会被挤在一起，排版不美观
 * 5、如果你的项目当中，使用的并不是Antd的框架，或者版本不一致，或者没有使用框架，可以自行更换框架样式文件或去除框架样式文件，此Demo的Antd版本为：4.23.4
 * 6、Vue项目、原生JS项目的原理类似，可以自行进行封装
 * 
 * 问题记录：
 * 1、Tab组件打印时，即使切换到了第二个Tab页签，但是打印时，永远都是第一个Tab页签内的内容？
 * 引入相关的样式文件之后，解决了此问题，样式文件地址：node_modules\antd\lib\tabs\style\index.css
 * 在打印过程中，如果有哪些组件打印不美观，或者打印出现问题，可以尝试引入此组件的样式文件
 * 
 * 2、Radio和CheckBox组件在打印时不显示勾选？
 * 打印并不一定支持background样式，而Antd当中的Radio和CheckBox组件，勾选的状态是使用background样式实现的，所以这里进行了单独的处理，参考handleAntdComponent方法
 */

const useWindowPrint = (options) => {
  // Props
  const { contentId, margin = "5mm", zoom, onBeforePrint, onBeforePrintContent, onAfterPrint } = options;

  // State
  const [isPrint, setIsPrint] = useState(false);

  // useEffect
  useEffect(() => {
    if (isPrint) {
      setTimeout(() => {
        handlePrintAction();
      });
    }
  }, [isPrint]);

  // 开始打印，更改state
  // useWindowPrint会等待状态更新完成，去获取最新的DOM，再打印
  const beginPrint = async () => {
    // 如果传递了onBeforePrint，则执行
    if (typeof onBeforePrint === "function") {
      await onBeforePrint();
    }
    setIsPrint(true);
  };

  // 打印操作
  const handlePrintAction = () => {
    const iframe = document.createElement("IFRAME");
    iframe.setAttribute("id", printContainerId);
    iframe.style.position = "absolute";
    iframe.style.top = "-100vh";
    iframe.style.left = "-100vw";
    iframe.onload = async () => {
      // 复制DOM节点
      const doc = iframe.contentWindow.document;
      const pageDom = document.getElementById(contentId);
      const pageDomClone = pageDom.cloneNode(pageDom);

      // 添加相关样式
      handleAddLinkToIframe(iframe, pageDomClone);

      // 处理部分Antd组件打印异常的问题
      handleAntdComponent(pageDomClone);

      // 如果传递了onBeforePrintContent，则执行，并将要打印的DOM传入回调函数
      if (typeof onBeforePrintContent === "function") {
        await onBeforePrintContent(pageDomClone, iframe);
      }

      // 将处理完成的DOM，添加到iframe当中
      doc.body.appendChild(pageDomClone);

      // 延时调用打印，防止样式不生效
      setTimeout(() => {
        iframe.contentWindow.print(); // 打印
        handlePrintFinished(iframe); // 处理打印完成
      }, 1000);
    };
    document.body.appendChild(iframe);
  };

  // 处理iframe当中的样式文件
  const handleAddLinkToIframe = (iframe, pageDomClone) => {
    const prefix = "/printStyle/";
    const cssLinkArr = [
      "antd.compact.min.css",
      "antd.min.css",
      "antd.variable.min.css",
      "commonPrint.css",
      "reset.min.css",
      "componentStyles/descriptions.css",
      "componentStyles/tabs.css",
    ];
    cssLinkArr.forEach((item) => {
      const linkDom = document.createElement("LINK");
      linkDom.href = prefix + item;
      linkDom.rel = "stylesheet";
      linkDom.type = "text/css";
      iframe.contentWindow.document.head.appendChild(linkDom);
    });

    // 处理打印时边距
    if (margin) {
      const styleDom = document.createElement("STYLE");
      styleDom.innerHTML = `@page { margin: ${margin}; }`;
      iframe.contentWindow.document.head.appendChild(styleDom);
    }

    // 处理打印时的缩放比例
    if (zoom) {
      pageDomClone.style.zoom = zoom;
    }
  };

  // 处理部分Antd组件打印异常的问题
  const handleAntdComponent = (pageDomClone) => {
    // 处理双表头重叠问题
    Array.from(pageDomClone.querySelectorAll(".ant-table-thead")).forEach((item) => {
      item.style.display = "contents";
    });

    // 处理textarea文字显示不全的问题
    Array.from(pageDomClone.querySelectorAll("textarea")).forEach((item) => {
      if (item.tagName === "TEXTAREA") {
        const parentNode = item.parentNode;
        const divDom = document.createElement("DIV");
        divDom.style.width = "100%";
        divDom.innerHTML = `<div class="print-textarea-container">${item.value}</div>`
        parentNode.replaceChild(divDom, item);
      }
    });

    // 处理单选未勾选的问题（打印可能不支持背景图形，所以需要特殊处理）
    Array.from(pageDomClone.querySelectorAll(".ant-radio-checked")).forEach((item) => {
      item.innerHTML = "<span class='dot'></span>";
    });

    // 处理多选框未勾选的问题（打印可能不支持背景图形，所以需要特殊处理）
    Array.from(pageDomClone.querySelectorAll(".ant-checkbox-checked")).forEach((item) => {
      item.innerHTML = "√";
    });

    // 处理input当中的文本过长无法显示的问题
    Array.from(pageDomClone.querySelectorAll(".ant-input")).forEach((item) => {
      if (item.tagName === "INPUT") {
        const value = item.value;
        const parentNode = item.parentNode;
        parentNode.classList.add("print-input-container");
        parentNode.innerHTML = value;
      }
    });
  };

  // 处理打印完成
  const handlePrintFinished = (iframe) => {
    iframe.remove(); // 移除iframe
    setIsPrint(false); // 打印完成，重置打印状态
    typeof onAfterPrint === "function" && onAfterPrint(); // 如果传递了onAfterPrint，则执行此回调
  };

  return [isPrint, beginPrint];
};

export default useWindowPrint;