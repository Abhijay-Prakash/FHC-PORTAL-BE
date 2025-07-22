export const generateAvatar = (name, gender) => {
    //const encodedUsername = encodeURIComponent(name);
        

   // //gotta change this as well, cuz generated images arent that professional 
   //   if (gender === "male") {
   //     return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodedUsername}`;
   // } else if (gender === "female") {
   //     return `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodedUsername}`;
   // } else {
   //     return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodedUsername}`;
   // }



    // above stuff isnt professinal, below is more professional but isnt reliable.. services might go down at any time
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
	const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;

    return gender === "male" ? boyProfilePic : girlProfilePic
};
