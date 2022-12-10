export const commonOptions = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Orange', value: 'Orange' },
  { label: 'Pear', value: 'Pear' },
];

export const listData = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money',
    align: 'right',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

// 生成表格数据的函数
export const generateTableData = (length) => {
  const tempArr = [];
  for (let index = 0; index < length; index++) {
    const item = {
      key: index,
      name: `${index} Jim Green`,
      money: `${index} ￥1,256,000.00`,
      address: `${index} London No. 1 Lake Park`,
    };
    tempArr.push(item);
  }
  return tempArr;
};
