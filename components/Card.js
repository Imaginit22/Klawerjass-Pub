import React from "react";
        const CardComp = ({/*img, width, style,*/ ...rest}) => {
            console.log("IMG: "/*, img*/)
            return (
                <div /*style={{...style}}*/>
                    <img /*src={img} width={width}*/ {...rest}/>
                </div>
            )
        }

export default CardComp;