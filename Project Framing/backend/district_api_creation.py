import pymysql


conn = pymysql.connect(host = 'localhost',
                        user = 'root',
                        password = 'tiger',
                        database= 'api',
                        cursorclass=pymysql.cursors.DictCursor
                        )
cursor = conn.cursor()

districts = [
    "Anantapur",
    "Chittoor",
    "East Godavari",
    "Guntur",
    "Krishna",
    "Kurnool",
    "Prakasam",
    "Srikakulam",
    "Sri Potti Sriramulu Nellore",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa"
]



for districts_list in districts:
    cursor.execute('insert into india_district (district, state) values (%s, "Andrapradesh")',(districts_list))
    conn.commit()