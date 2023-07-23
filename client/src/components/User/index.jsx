import './style.css'

export default function User({pfpSize = "128", userData, currentUserId = null}){
    const {id: userId, avatar, global_name, discriminator, username} = userData
    return <div className="user" userid={userId}>
        <img className="pfp" src={`https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=${pfpSize}`}/>
        <div className='user-text-wrapper'>
            <span className="global-name">{currentUserId == userId ? "(Moi) " + String(global_name) : String(global_name)}</span>
            <span className="username">{Number(discriminator) ? username+"#"+discriminator : username}</span>
        </div>
    </div>
}