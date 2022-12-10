import { Button, Row, Table, Spin } from "antd";
import useWindowPrint from "../hooks/useWindowPrint";
import { columns, generateTableData } from "../options/PrintTableOptions";

const PrintTable = () => {

  // useWindowPrint Hook
  const [isPrint, beginPrint] = useWindowPrint({
    contentId: "PrintTableId",
    margin: "5mm", // 打印的边距
    // 打印DOM结构之前的回调，可以处理打印时DOM结构
    onBeforePrintContent: (pageDomClone, iframe) => new Promise((resolve) => {
      const classList = [
        ".ant-table-tbody>tr>td",
        ".ant-table-thead>tr>th",
        ".ant-table tfoot>tr>td",
        ".ant-table tfoot>tr>th",
      ];
      classList.forEach((className) => {
        Array.from(pageDomClone.querySelectorAll(className)).forEach((item) => {
          item.style.padding = "2px";
          item.style.fontSize = "12px";
        });
      });
      resolve();
    }),
  });

  // 根据打印的状态计算表格的滚动
  const scrollOption = isPrint ? {} : { x: columns.length * 150, y: 500 };

  // 打印
  const handlePrint = () => {
    beginPrint();
  };

  return (
    <div id="PrintTableId">
      <Spin spinning={false}>

        {/* 横向和纵向都滚动的表格 */}
        <Table
          columns={columns}
          dataSource={generateTableData(30)}
          bordered
          scroll={scrollOption}
          title={() => "报表数据汇总"}
          pagination={false}
        />

        {/* 打印按钮，需要在打印的时候进行隐藏 */}
        <Row justify="center" style={{ marginTop: "20px" }}>
          { !isPrint && <Button type="primary" onClick={handlePrint}>开始打印</Button> }
        </Row>
      </Spin>
    </div>
  );
};

export default PrintTable;