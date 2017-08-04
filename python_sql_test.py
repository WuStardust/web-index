import pymysql


def connDB():
    # connect the database
    conn = pymysql.connect(host='localhost', user='root',
                           passwd='071420', db='web-index')
    cur = conn.cursor()

    return (conn, cur)


def update(conn, cur, sql):
    # update / insert
    sta = cur.execute(sql)
    conn.commit()

    return (sta)


def delete(conn, cur, IDs):
    # delete one or more datas
    for eachID in IDs:
        sta = cur.execute('delete from index_test where Id=%d' % int(eachID))

    conn.commit()

    return sta


def query(cur, sql):
    # query datas
    cur.execute(sql)
    result = cur.fetchone()

    return result


def getAllInf(cur, sql):
    cur.execute(sql)
    result = cur.fetchall()

    return result


def connClose(conn, cur):
    # close all connects
    cur.close()
    conn.close()


(conn, cur) = connDB()

# exeUpdate(conn, cur,
#           "INSERT INTO index_test (name, number, phone) VALUES('bnmv', 'U201436579', '14325694213');")
# print(exeQuery(cur, "SELECT name, number, phone FROM index_test;"))
