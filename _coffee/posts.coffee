translateDay = (day) ->
    dia = day
    switch(day)
        when 'Mon' then dia = 'Lun'
        when 'Tue' then dia = 'Mar'
        when 'Wed' then dia = 'Mié'
        when 'Thu' then dia = 'Jue'
        when 'Fri' then dia = 'Vié'
        when 'Sat' then dia = 'Sáb'
        when 'Sun' then dia = 'Dom'
    dia

translateMonth = (month) ->
    mes = month
    switch(month)
        when 'Jan' then mes = 'Ene'
        #when 'Feb' then mes = 'Ene'
        #when 'Mar' then mes = 'Ene'
        when 'Apr' then mes = 'Abr'
        #when 'May' then mes = 'Ene'
        #when 'Jun' then mes = 'Ene'
        #when 'Jul' then mes = 'Ene'
        when 'Aug' then mes = 'Ago'
        #when 'Sep' then mes = 'Ene'
        #when 'Oct' then mes = 'Ene'
        #when 'Nov' then mes = 'Ene'
        when 'Dec' then mes = 'Dic'
    mes

(->
    $('.post_created_time').each (k, v) ->
        v = $ v
        parts = /^(\w{3}), \d\d (\w{3}).+$/i.exec v.text()
        dia = translateDay parts[1]
        mes = translateMonth parts[2]

        v.text(v.text().replace(parts[1], dia).replace(parts[2], mes))
)()