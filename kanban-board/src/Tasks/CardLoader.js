import React from "react"
import ContentLoader from "react-content-loader"

const CardLoader = (props) => (
  <ContentLoader 
    speed={2}
    width="100%"
    height="200px"
    viewBox="0 0 400 200"
    backgroundColor="#9684f0"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="9" y="23" rx="0" ry="0" width="100%" height="200" />
  </ContentLoader>
)

export default CardLoader;