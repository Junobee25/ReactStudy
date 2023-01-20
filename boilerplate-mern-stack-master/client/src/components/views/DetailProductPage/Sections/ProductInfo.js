import { Button, Descriptions } from "antd";
import React from "react";
function ProductInfo(props) {
  // props로 정보 가져오기
  const clickHandler = (event) => {
        // 필요한 정보를 Cart Field에 넣어주기 필요한 것 상품ID,갯수,date정보
  }
  return (
    <div>
      <Descriptions title="Product Info" bordered>
        <Descriptions.Item label="Price">
          {props.detail.price}
        </Descriptions.Item>
        <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
        <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {props.detail.description}
        </Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button size="large" shape="round" type="danger" onClick={clickHandler}>
            Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductInfo;
