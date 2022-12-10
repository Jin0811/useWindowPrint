// 表格列
export const columns = [
  { title: "公司名称", dataIndex: "name", width: 150 },
  { title: "公司地址", dataIndex: "address", width: 150 },
  { title: "第一季度报表数据", dataIndex: "quarter1", width: 150 },
  { title: "第二季度报表数据", dataIndex: "quarter2", width: 150 },
  { title: "第三季度报表数据", dataIndex: "quarter3", width: 150 },
  { title: "第四季度报表数据", dataIndex: "quarter4", width: 150 },
  { title: "一季度是否正常", dataIndex: "isNormal", width: 150 },
  { title: "二季度是否正常", dataIndex: "isNormal", width: 150 },
  { title: "三季度是否正常", dataIndex: "isNormal", width: 150 },
  { title: "四季度是否正常", dataIndex: "isNormal", width: 150 },
  { title: "所属区域", dataIndex: "area", width: 150 },
  { title: "所属机构", dataIndex: "organization", width: 150 },
];

// 生成表格数据的函数
export const generateTableData = (length) => {
  const tempArr = [];
  for (let index = 0; index < length; index++) {
    const item = {
      key: index,
      name: `公司${index}`,
      address: `地址${index}`,
      phone: `${index}`.repeat(11),
      quarter1: `季度一 ${index}`,
      quarter2: `季度二 ${index}`,
      quarter3: `季度三 ${index}`,
      quarter4: `季度四 ${index}`,
      isNormal: `${index % 2 === 0 ? "是" : "否"}`,
      area: "中国",
      organization: "很长很长很长很长很长很长很长很长很长很长的机构名称",
    };
    tempArr.push(item);
  }
  return tempArr;
};