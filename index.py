from flask import Flask, request, render_template
import pymysql
import json

Loginfo = {'HOST': 'localhost', 'USER': 'root', 'PSWD': '071420', 'DB': 'web-index'}


def connDB():
    # connect the database
    conn = pymysql.connect(host=Loginfo['HOST'], user=Loginfo['USER'],
                           passwd=Loginfo['PSWD'], db=Loginfo['DB'], charset='utf8')
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


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/info/list', methods=['GET'])
def returnAllInf():
    conn, cur = connDB()
    data = getAllInf(cur, "SELECT * FROM index_test;")
    fields = cur.description
    connClose(conn, cur)

    column_list = []
    for i in fields:
        column_list.append(i[0])

    JSONdata = []
    i = 0
    for inf in data:
        result = {}
        result['id'] = inf[0]
        result['name'] = inf[1]
        result['number'] = inf[2]
        result['phone'] = inf[3]
        JSONdata.append(result)
    return json.dumps(JSONdata)


@app.route('/info/modify', methods=['PUT'])
def modifyInf():
    conn, cur = connDB()
    sql = "UPDATE index_test SET name='%s', number='%s', phone='%s' WHERE id='%s'" % (
        request.form["name"], request.form["number"], request.form["phone"], request.form["id"])

    update(conn, cur, sql)

    connClose(conn, cur)

    return json.dumps(0)


@app.route('/info/add', methods=['POST'])
def addInf():
    conn, cur = connDB()
    # INSERT INTO index_test (name, number, phone) VALUES('bnmv', 'U201436579', '14325694213');"
    sql = "INSERT INTO index_test (name, number, phone) VALUES('%s', '%s', '%s');" % (
        request.form["name"], request.form["number"], request.form["phone"])

    update(conn, cur, sql)

    connClose(conn, cur)

    return json.dumps(0)


if __name__ == '__main__':
    app.run(port=9055)
