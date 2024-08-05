console.log('Let us Begin')
let currentSong = new Audio();
function formatTime(seconds) {
    // Use Math.floor to round down to the nearest whole number of seconds
    seconds = Math.floor(seconds);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad minutes and seconds with leading zeros if needed
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
let songs;
let currFolder;
async function getSongs(folder){
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let lis = div.getElementsByTagName("a")
    // console.log(lis)
    songs = []
    for (let index = 0; index < lis.length; index++) {
        const element = lis[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${currFolder}/`)[1])
        }
        
    }
    // return songs
}
const playMusic = (track,pause=false) =>{
    // let audio =new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
    currentSong.play()
    play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}
async function main(){
    await getSongs("songs/delight")
    playMusic(songs[0],true)
    // console.log(songs)  songs = 
    // var audio = new Audio(songs[0]);
    let songUl = document.querySelector(".songList").getElementsByTagName('ul')[0]
    songUl.innerHTML = ""
    for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `<li>
                        <img src="music.svg" alt="">
                        <div class="songInfo">
                        <div class="songName">${song.replace("%20"," ")}</div>
                        <div class="songArtist">Akshat</div>
                        </div>
                        <div class="playNow">
                            <span>Play Now</span>
                            <img src="play.svg" alt="">
                        </div>
                    </li>`;   
    }
    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
        e.addEventListener("click",element=>{
        console.log(e.querySelector(".songInfo").firstElementChild.innerHTML)
        playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML.trim())
        })
    })
    //to play next and previous
    play.addEventListener("click",() =>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    // audio.play();
    // audio.addEventListener("loadeddata",() =>{
    //     let duration = audio.duration;
    //     console.log(duration,audio.currentSrc,audio.currentTime)
    // }) 
    // time update event 
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
    })

    //to seekbar
    document.querySelector(".seekBar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent+"%"
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"        
    })

    previous.addEventListener("click",()=>{
        console.log("previous clicked")
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>= 0){
        playMusic(songs[index-1])
        }
    })
    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length - 1){
        playMusic(songs[index+1])
        }
        
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e.target.value)
        currentSong.volume=parseInt(e.target.value)/100
    })

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click",async item =>{
            console.log(item,item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
    
}

main()
