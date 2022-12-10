import { useEffect } from "react";
import {
  Button, Row, Col, Form, Input, Checkbox, Radio,
  DatePicker, Select, Typography, Table, Card,
  Descriptions, List, Spin
} from "antd";
import useWindowPrint from "../hooks/useWindowPrint";
import { commonOptions, listData, columns, generateTableData } from "../options/printDemoOptions";
import moment from "moment";

const { TextArea } = Input;
const { Title } = Typography;

const PrintDemo = () => {
  const [form] = Form.useForm();

  // useWindowPrint Hook
  const [isPrint, beginPrint] = useWindowPrint({
    contentId: "PrintDemoId",
    margin: "5mm", // 打印的边距
    zoom: 1, // 打印时的缩放比例，仅支持chrome和IE，火狐不支持
    // 打印之前的回调，可以处理State
    onBeforePrint: () => new Promise((resolve) => {
      resolve();
    }),
    // 打印DOM结构之前的回调，可以处理打印时DOM结构
    onBeforePrintContent: (pageDomClone, iframe) => new Promise((resolve) => {
      console.log(pageDomClone, iframe);
      resolve();
    }),
    // 打印完成之后的回调
    onAfterPrint: () => new Promise((resolve) => {
      resolve();
    }),
  });

  // 打印
  const handlePrint = () => {
    beginPrint();
  };

  // 进行表单赋值
  useEffect(() => {
    form.setFieldsValue({
      shortText: "很短的文本",
      longText: "很长的文本，导致了一行无法放下，这里进行了处理，会自动进行撑开",
      checkBoxValue: ["Apple", "Orange"],
      radioValue: "Apple",
      select: "Orange",
      date: moment("2022-11-11"),
      textarea: "文本域当中，有很长很长的文字。".repeat(120),
    });
  }, []);

  return (
    <div id="PrintDemoId">
      <Spin spinning={false}>
        {/* 打印按钮，需要在打印的时候进行隐藏 */}
        <Row justify="center">
          { !isPrint && <Button type="primary" onClick={handlePrint}>开始打印</Button> }
        </Row>

        {/* 页面的大标题 */}
        <Row justify="center">
          <Title level={4}>页面的大标题</Title>
        </Row>

        {/* 表单 */}
        <Form form={form} labelCol={{ span: 6 }}>
          <Row>
            <Col span={11}>
              <Form.Item name="shortText" label="普通短文本">
                <Input />
              </Form.Item>
            </Col>
            <Col offset={2} span={11}>
              <Form.Item name="longText" label="普通长文本">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item name="checkBoxValue" label="多选框">
                <Checkbox.Group options={commonOptions} />
              </Form.Item>
            </Col>
            <Col offset={2} span={11}>
              <Form.Item name="radioValue" label="单选框">
                <Radio.Group options={commonOptions} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item name="select" label="下拉选择">
                <Select options={commonOptions}></Select>
              </Form.Item>
            </Col>
            <Col offset={2} span={11}>
              <Form.Item name="date" label="日期选择">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item labelCol={{ span: 3 }} name="textarea" label="文本域">
                <TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* 卡片 */}
        <Card title="Default size card" size="small" extra={<span>More</span>}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>

        {/* 描述列表 */}
        <Descriptions title="User Info" bordered>
          <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
          <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
          <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
          <Descriptions.Item label="Order time">2018-04-24 18:00:00</Descriptions.Item>
          <Descriptions.Item label="Usage Time" span={2}>
            2019-04-24 18:00:00
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={3}>Running</Descriptions.Item>
          <Descriptions.Item label="Negotiated Amount">$80.00</Descriptions.Item>
          <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
          <Descriptions.Item label="Official Receipts">$60.00</Descriptions.Item>
          <Descriptions.Item label="Config Info">
            Data disk type: MongoDB<br />
            Database version: 3.4<br />
            Package: dds.mongo.mid<br />
            Storage space: 10 GB<br />
            Replication factor: 3<br />
            Region: East China 1<br />
          </Descriptions.Item>
        </Descriptions>

        {/* 列表 */}
        <List
          size="small"
          header={<div>Header</div>}
          footer={<div>Footer</div>}
          bordered
          dataSource={listData}
          renderItem={item => <List.Item>{item}</List.Item>}
        />

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={generateTableData(30)}
          bordered
          title={() => 'Header'}
          footer={() => 'Footer'}
          pagination={false}
        />

        <Row className="page-break">
          {
            `一段普通的说明文本，测试文字是否会被截断，
            一般情况下，文字会自动进行换页，来避免被截断，
            如果你想手动进行换页，则可以在元素上添加className='page-break'来进行换页，
            注意：这个被换到下一页的元素，尽量不要被Space组件包裹，不然可能无法进行换页
            page-break 样式在commonPrint.css当中定义
            `.repeat(30)
          }
        </Row>
      </Spin>
    </div>
  );
};

export default PrintDemo;