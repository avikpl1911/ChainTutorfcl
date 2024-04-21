import "./card.css";

export function Card({data}) {
  return (
    <>
      <div className="card w-96  glass backdrop-blur " style={{padding:"20px"}}>
        <figure>
          <img
            src={`http://localhost:7000/img/course/${data.img}`}
            alt="course"
          />
        </figure>
        <div className="card-body ">
          <h2 className="card-title">{data.name}</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">{`${data.price} flow`}</button>
          </div>
        </div>
      </div>
    </>
  );
}
