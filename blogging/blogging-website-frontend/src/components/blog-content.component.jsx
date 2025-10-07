const BlogContent = ({ block }) => {
    const Img = ({ url, caption }) => {
        return (
            <div>

                <img src={url} />
                {
                    caption.length ? <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey" >{caption}</p> : " "
                }
            </div>
        )

    }
    const Quote = ({ quote, caption }) => {
        return (
            <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple" >
                <p className="text-xl leading-10 md:text-2xl " >{quote}</p>
                {
                    caption.length ? <p className="w-full text-base text-purple" >{caption}</p> : " "
                }
            </div>
        )
    }
    const List = ({ style, items }) => {
        return (
            <ol className={style == "ordered" ? "list-decimal" : " list-"} >
                {
                    items.map((listItem, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: listItem }}></li>
                    ))

                }
            </ol>
        )

    }
    let { type, data } = block
    if (type == "paragraph") {
        return (
            <p dangerouslySetInnerHTML={{ __html: data.text }} ></p>
        )
    }
    if (type == "heading") {
        if (data.level == 3) {
            return <h3 className="font-bold text-3xl" dangerouslySetInnerHTML={{ __html: data.text }} ></h3>
        }
        if (data.level == 2) {
            return <h2 className="font-bold text-4xl" dangerouslySetInnerHTML={{ __html: data.text }} ></h2>
        }
        if (data.level == 1) {
            return <h1 className="font-bold text-5xl" dangerouslySetInnerHTML={{ __html: data.text }} ></h1>
        }
    }
    if (type == "image") {
        return <Img url={data.file.url} caption={data.caption} />
    }
    if (type == "quote") {
        return <Quote quote={data.quote} caption={data.caption} />
    }
    if (type == "list") {
        return <List style={data.style} items={data.items} />
    }
}
export default BlogContent