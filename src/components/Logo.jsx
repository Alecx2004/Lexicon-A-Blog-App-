import Logoimage from "../assets/Logo6.png"
function Logo({width = '80%'}) {
  return (
    <div className="my-5">
        <img src={Logoimage} alt="" width={width} />
    </div>
  )
}

export default Logo