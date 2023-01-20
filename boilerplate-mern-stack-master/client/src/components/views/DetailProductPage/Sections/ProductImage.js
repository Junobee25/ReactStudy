import React,{useState,useEffect} from 'react';
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {

    const [images, setImages] = useState([])

    useEffect(() => {
      if(props.detail.images && props.detail.images.length > 0){
        let images = []

        props.detail.images.map(item => {
            images.push({
                original: `http://localhost:5000/${item}`, // Dynamic하게 바꿔줘야 함
                thumbnail:`http://localhost:5000/${item}`
            })
        })
        setImages(images)
      }
    
      return () => {
        
      }
    }, [props.detail]) // props.detail이 바뀔때마다 lift cycle을 한번더 실행
    

  return (
    <div>
        <ImageGallery items={images}/>
    </div>
  )
}

export default ProductImage