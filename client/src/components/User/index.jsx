import './style.css'

export default function User({pfpSize = "128", userData, currentUserId = null, onClick}){
    const {id: userId, avatar, global_name, discriminator, username} = userData
    return <div className="user" userid={userId} onClick={() => {if(typeof onClick == "function") onClick(userData)}}>
        <img className="pfp" src={
            avatar ? 
            `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=${pfpSize}` 
            : "https://ia803204.us.archive.org/4/items/discordprofilepictures/discordblue.png"}
        />
        <div className='user-text-wrapper'>
            <span className="global-name">{currentUserId == userId ? "(Moi) " + String(global_name) : String(global_name)}</span>
            <span className="username">{Number(discriminator) ? username+"#"+discriminator : username}</span>
        </div>
    </div>
}