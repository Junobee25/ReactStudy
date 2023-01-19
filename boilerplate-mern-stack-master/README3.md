# _2023-01-18_

## 라디오 박스 필터 만들기 (가격에 따라서 요소들 필터링)

1. RadioBox 리스트 데이터들 만들기
2. RadioBox를 위한 UI만들기
3. onChange Function 만들기
4. Checked State를 부모 컴포넌트로 업데이트하기

### 1. RadioBox 리스트 데이터들 만들기

📌 client/src/components/LandingPage/Sections/Datas.js  
_UI에 `export`할 data만들어주기_
### 2. UI 만들기
LandingPage.js

```JavaScript
<Row gutter={[16,16]}>
    <Col lg={12} xs={24}>
        {/** CheckBox */}
        <Checkbox list={continents} handleFilters=          
        {filter=>handleFilters(filter,"continents")}/>
    </Col>
    <Col lg={12} xs={24}>
        <RadioBox list ={price} handleFilters=
        {filter=>handleFilters(filter,"price")} >
        </RadioBox>
    </Col>
</Row>
```
### 3,4 onChange Function + useState로 업데이트
RadioBox.js
```JavaScript
import React, { useState } from "react";
import { Collapse, Radio } from "antd";
const {Panel} = Collapse;
function RadioBox(props) {

    const [Value, setValue] = useState(0)

    const renderRadioBox = () => (
        props.list && props.list.map(value => (
            <Radio key={value._id} value={value._id}>{value.name}</Radio>

        ))
    )
   const handleChange = (event) => {
        setValue(event.target.value)
        props.handleFilters(event.target.value)
   }
  return (
    <div>
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="This is panel header 1" key="1">
            <Radio.Group onChange={handleChange} value={Value}>
                {renderRadioBox()}
            </Radio.Group>
        </Panel>
      </Collapse>
    </div>
  );
}

export default RadioBox;
```
# _2023-01-19_
## 라디오박스 필터 만들기 2 
1. handleFilter Function
2. handleFilter를 위한 handlePrice funcion 만들기
3. 필터 기능을 위한 getProduct Router 수정

✅ 1,2 handleFilter Function  handleFilter를 위한 handlePrice funcion 만들기  
LandingPage.js
```JavaScript
 const handlePrice = (value) => {
    const data = price;
    let array = [];
    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };

    newFilters[category] = filters;

    console.log("filters", filters);

    if (category === "price") {
      let priceValues = handlePrice(filters);
      newFilters[category] = priceValues;
    }
    showFilterResults(newFilters);
    setFilters(newFilters)
  };
```
✅ 3. 필터 기능을 위한 getProduct Router 수정

product.js
```JavaScript
for(let key in req.body.filters){

    if(req.body.filters[key].length>0){

      console.log('key',key)  // <----
      if(key === "price"){
        findArgs[key] = {
          // greater than equal 이것보다 크거나 같고
          $gte:req.body.filters[key][0], // 0
          // less than equal [0,199],[200,249],,,,
          $lte:req.body.filters[key][1] // 199
        }

      }else{
        findArgs[key] = req.body.filters[key];
      }

    }

  }
  console.log('findArgs',findArgs)
```
