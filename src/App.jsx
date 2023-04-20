import { useEffect, useState } from "react";
import Web3 from "web3";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  NFT_ABI,
  NFT_ADDRESS,
} from "./web3.config";

//const web3 = new Web3(); // 왜 밖에쓰지? 선언이라서?
//https://rpc-mumbai.maticvigil.com 이걸 제공해 줍니다 이걸 프로바이더라고 합니다
const web3 = new Web3(window.ethereum);
//훅스도 아니어서 밖에 써도 무관
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
const nftContract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);

function App() {
  const [account, setAccount] = useState(""); //훅스고 함수형 컴퍼넌트라서 안에 선언해야함
  const [myBalance, setMyBalance] = useState(); //1

  const onClickAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };
  const onClickLogOut = () => {
    setAccount("");
  };
  const onClickBalance = async () => {
    try {
      if (!account || !contract) return;

      //왜d가 찍힐까?
      //조성윤 — 오늘 오후 2:48
      //그냥 콘솔로그로 찍어도 나오는데 유즈이펙트 쓰는 이유가 있을까요?
      //ans 가끔씩 안찍히는 경우가 있어서

      const balance = await contract.methods.balanceOf(account).call();
      //const totalSupply = await contract.methods.totalSupply(account<- 이거 비워야함).call(); total은 아무런 인자를 요구하지 않음
      setMyBalance(web3.utils.fromWei(balance)); //setMyBalance(balance); //1
    } catch (error) {
      console.error(error);
    }
  }; //블록체인과 소통해야하니 비동기 함수로 받아야함 안받으면 펜딩남
  const onClickMint = async () => {
    try {
      if (!account) return;

      const result = await nftContract.methods
        .mintNft(
          "https://gateway.pinata.cloud/ipfs/QmeqZF1Rkeyp1NS52KKJG9HJdUs3RxasNbYYPtrpKKvSWN"
        )
        .send({ from: account }); //send부분에 누가 발행하는지

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(nftContract);
  }, []);

  return (
    <div className="bg-red-100 min-h-screen flex justify-center items-center">
      {account ? (
        <div>
          <div className="text-main font-semibold text-2xl">
            {account.substring(0, 4)}...
            {account.substring(account.length - 4)}
            <button className="ml-4 btn-style" onClick={onClickLogOut}>
              로그아웃
            </button>
          </div>
          <div className="flex items-center mt-4">
            {myBalance && <div>{myBalance} tMatic</div>}
            <button className="ml-2 btn-style" onClick={onClickBalance}>
              잔액 조회
            </button>
          </div>
          <div className="flex items-center mt-4">
            <button className="ml-2 btn-style" onClick={onClickMint}>
              민팅
            </button>
          </div>
        </div>
      ) : (
        <button className="btn-style" onClick={onClickAccount}>
          <img
            className="w-12"
            src={`${process.env.PUBLIC_URL}/images/metamask.png`}
          />
        </button>
      )}
    </div>
  );
}

export default App;
//return안쪽에는 에이치 티엠엘 문법이 들어감  //이 안에서 자스 코드 쓸려면 중괄호{} 표시를 해놨어요//근데 빽틱 달러 줄괄호 자바 스크립트 문법이에요//{}은 리액트 문법!  //배열 42 -4 한거임
//반복되는스타일은 css layer component 반복되는 색상
//사용 차이점
//테일 confic에 main색상은?

// 선생님 어떨때 config에 정의하고 어떨때 css에 정의하는지 한 번 더 알려주실 수 잇나요
// 아하 넵 config에서 키값은 중복해서 써도 상관없죠?? color나 font 같이 나눠서.

// 권세명 — 오늘 오후 2:33
// const의 위치는 그냥 return 위에 아무데나 두면 되나요?

// 박석훈 — 오늘 오후 2:34
// 혹시 주소 불러올 떄 다 소문자로 오는데, 원래주소처럼 대소문자 구분되어 주소를 받을 수는없을까요??
//str.toUpperCase()

//npm i web3 설치

//next.js 서버 사이드 랜더링
//react 클라이언트사이드
