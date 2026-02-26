import HeadphonesIcon from "../icons/HeadphonesIcon";

function Support() {
  return (
    <a href="https://t.me/iDekUz" className="flex items-center justify-between">
      <div className="mt-4 flex flex-col items-center gap-2 text-[1.3rem] text-[#7a7fa8]">
        <h3 className="text-[1.6rem] text-purple-dark weight-bold">
          Yordam kerakmi?
        </h3>
        <p className="text-purple-muted text-[1.2rem]">
          Qo’llab-quvvatlash bilan bog’laning
        </p>
      </div>
      <HeadphonesIcon className="w-[4.4rem] shadow-inset-top text-purple-dark bg-light-gradient rounded-[0.8rem] p-[.9rem]" />
    </a>
  );
}

export default Support;
