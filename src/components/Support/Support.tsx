import HeadphonesIcon from "../icons/HeadphonesIcon";

type Props = {};

function Support({}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-[1.6rem] text-purple-dark weight-bold">
          Yordam kerakmi?
        </h3>
        <p className="text-purple-muted text-[1.2rem]">
          Qo’llab-quvvatlash bilan bog’laning
        </p>
      </div>
      <HeadphonesIcon className="w-[4.4rem] shadow-inset-top   text-purple-dark bg-light-gradient rounded-[0.8rem] p-[.9rem]" />
    </div>
  );
}

export default Support;
