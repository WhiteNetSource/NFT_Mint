import { useEffect, useState } from "react";
import Web3 from "web3";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  NFT_ABI,
  NFT_ADDRESS,
} from "./web3.config";
import axios from "axios";

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
const nftContract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);

function App() {
  const [account, setAccount] = useState("");
  const [myBalance, setMyBalance] = useState();
  const [nftMetadata, setNftMetadata] = useState();

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

      const balance = await contract.methods.balanceOf(account).call();

      setMyBalance(web3.utils.fromWei(balance));
    } catch (error) {
      console.error(error);
    }
  };
  const onClickMint = async () => {
    try {
      if (!account) return;

      const result = await nftContract.methods
        .mintNft(
          "https://gateway.pinata.cloud/ipfs/QmZ5ynCXHF5LyFwehgMxQQuxrq3x1hs7zcgo1bQ2QsRCmH"
        )
        .send({ from: account });

      if (!result.status) return;

      const balanceOf = await nftContract.methods.balanceOf(account).call();

      const tokenOfOwnerByIndex = await nftContract.methods
        .tokenOfOwnerByIndex(account, parseInt(balanceOf) - 1)
        .call();

      const tokenURI = await nftContract.methods
        .tokenURI(tokenOfOwnerByIndex)
        .call();

      const response = await axios.get(tokenURI);

      setNftMetadata(response.data);
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
            {nftMetadata && (
              <div>
                <img src={nftMetadata.image} alt="NFT" />
                <div>Name : {nftMetadata.name}</div>
                <div>Description : {nftMetadata.description}</div>
              </div>
            )}
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
