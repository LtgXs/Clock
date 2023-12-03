import requests
import os

#CN
api_url_cn = "https://cn.bing.com/HPImageArchive.aspx?n=1&mkt=zh-cn&idx=0&format=js"
response = requests.get(api_url_cn)
if response.status_code == 200:
    
    data = response.json()
    urlbase = data["images"][0]["urlbase"]
    url = "https://www.bing.com" + urlbase + "_UHD.jpg"
    image_data = requests.get(url).content
    image_path = os.path.join("img", "background.jpg")
    os.makedirs(os.path.dirname(image_path), exist_ok=True)
    with open(image_path, "wb") as f:
        f.write(image_data)
        f.close()
    print(f"图片已经保存到 {image_path}")

    enddate = data["images"][0]["enddate"]
    yy = f"{enddate[:4]}"
    mm = f"{enddate[4:6]}"
    dd = f"{enddate[6:]}"
    enddate = f"{enddate[:4]}-{enddate[4:6]}-{enddate[6:]}"

    copy = data["images"][0]["copyright"]
    title = data["images"][0]["title"]
    info_path = os.path.join("img","info")
    with open(info_path, "w", encoding='utf-8') as f:
        f.write(f"## Today's Bing Wallpaper\n")
        f.write(f"Title: {title}\n")
        f.write(f"Update: {enddate}\n")
        f.write(f"Copyright: {copy}\n")
        f.write(f"\nAuto get programm by LtgX\n")
    print(f"信息已经保存到 {info_path}")
    
else:
    print(f"请求失败，状态码为 {response.status_code}")

#Global
api_url_global = "https://global.bing.com/HPImageArchive.aspx?n=1&setmkt=%s&setlang=en&idx=0&format=js"
response = requests.get(api_url_global)
if response.status_code == 200:
    
    data = response.json()
    urlbase = data["images"][0]["urlbase"]
    url = "https://www.bing.com" + urlbase + "_UHD.jpg"
    image_data = requests.get(url).content
    image_path = os.path.join("img", "background_global.jpg")
    os.makedirs(os.path.dirname(image_path), exist_ok=True)
    with open(image_path, "wb") as f:
        f.write(image_data)
        f.close()
    print(f"图片已经保存到 {image_path}")

    enddate = data["images"][0]["enddate"]
    yy = f"{enddate[:4]}"
    mm = f"{enddate[4:6]}"
    dd = f"{enddate[6:]}"
    enddate = f"{enddate[:4]}-{enddate[4:6]}-{enddate[6:]}"

    copy = data["images"][0]["copyright"]
    title = data["images"][0]["title"]
    info_path = os.path.join("img","info_global")
    with open(info_path, "w", encoding='utf-8') as f:
        f.write(f"## Today's Bing Wallpaper\n")
        f.write(f"Title: {title}\n")
        f.write(f"Update: {enddate}\n")
        f.write(f"Copyright: {copy}\n")
        f.write(f"\nAuto get programm by LtgX\n")
    print(f"信息已经保存到 {info_path}")
    
else:
    print(f"请求失败，状态码为 {response.status_code}")

