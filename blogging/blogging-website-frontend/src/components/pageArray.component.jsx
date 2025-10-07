const PageArrayCard = ({style,page})=>{
    const isFirstElement = page==0 ? true : false
    return (
        <div className={`border-r-[1px] text-center bg-grey/70 z-index-5` + (isFirstElement ? ` border-l `: ` `)} style={style} >
                {page}
        </div>
    )
}
export default PageArrayCard;