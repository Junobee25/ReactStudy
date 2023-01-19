# _2023-01-18_

## 라디오 박스 필터 만들기 (가격에 따라서 요소들 필터링)

1. RadioBox 리스트 데이터들 만들기
2. RadioBox를 위한 UI만들기
3. onChange Function 만들기
4. Checked State를 부모 컴포넌트로 업데이트하기

### 1. RadioBox 리스트 데이터들 만들기

📌 client/src/components/LandingPage/Sections/Datas.js  
_UI에 export할 data만들어주기_

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
