'use strict';

(() => {
  const ru = {
    'Import': 'Импорт',
    'Reset all': 'Сбросить всё', 'Reset statistics for client “{name}”? Traffic totals and the saved last handshake will be cleared for this client only. Keys, configuration and VPN connections are preserved. This cannot be undone in the panel. Continue?': 'Сбросить статистику клиента «{name}»? Только у этого клиента обнулятся трафик и сохранённое время последнего обмена ключами. Ключи, конфигурация и VPN-соединения сохранятся. Отменить сброс в панели нельзя. Продолжить?',
    'Reset traffic for upstream “{name}”? Only its accumulated traffic will be cleared. Configuration, connections and handshake times are preserved. This cannot be undone in the panel. Continue?': 'Сбросить трафик туннеля «{name}»? Обнулится только его накопленный трафик. Конфигурация, соединения и время обмена ключами сохранятся. Отменить сброс в панели нельзя. Продолжить?',
    'Automatic failover checks upstream availability and switches the default route to another eligible tunnel when the current one fails. Enable it to edit the check parameters; disabling preserves their saved values.': 'Автоматическое резервирование проверяет доступность выходных туннелей и при отказе текущего переключает маршрут по умолчанию на другой подходящий туннель. Включите резервирование, чтобы изменить параметры проверок. При выключении сохранённые значения не теряются.',

    'Export': 'Экспорт', 'Export: {name}': 'Экспорт: {name}',
    "Edit tunnel": "Изменить туннель",
    "Edit mode": "Что изменить",
    "Connection address": "Адрес подключения",
    "Replace configuration": "Заменить конфигурацию",
    "Remote address and UDP port": "Удалённый адрес и UDP-порт",
    "Configuration file": "Файл конфигурации",
    "Configuration text": "Текст конфигурации",
    "The file can change the protocol and local port. Existing routing assignments and failover priority are kept.": "Файл может изменить протокол и локальный порт. Привязки маршрутов и приоритет резервирования сохраняются.",
    "Saving restarts this tunnel if enabled. Check for a fresh handshake afterwards.": "При сохранении включённый туннель перезапустится. Затем проверьте, появился ли свежий обмен ключами.",
    "Unable to apply upstream configuration; previous configuration restored": "Не удалось применить конфигурацию. Предыдущая конфигурация восстановлена.",
    "Configuration file is too large": "Файл конфигурации слишком большой",
    "Upstream tunnels and failover": "Выходные туннели и резервирование",
    "Loading tunnels\u2026": "Загрузка туннелей…",
    "Server": "Сервер",
    "Availability": "Доступность",
    "Current": "Текущий",
    "Preferred": "Предпочтительный",
    "Backup": "Резервный",
    "Details": "Подробности",
    "Current route: {name}": "Текущий маршрут: {name}",
    "No route selected": "Маршрут не выбран",
    "Route blocked": "Маршрут заблокирован",
    "Failover enabled": "Резервирование включено",
    "Failover disabled": "Резервирование выключено",
    "Backup route in use": "Используется резервный маршрут",
    "Checks disabled": "Проверка выключена",
    "Excluded from failover": "Исключён из резервирования",
    "Availability checks Internet access through the tunnel. Connection indicates handshake status.": "Доступность — результат проверки выхода в интернет через туннель. Подключение — состояние обмена ключами.",
    'Primary route': 'Основной', 'Check': 'Проверка', 'Successful': 'Успешная',
    'Add': 'Добавить', 'Local UDP port': 'Локальный UDP-порт', 'Choose file': 'Выбрать файл',
    'Add tunnel': 'Добавить туннель', 'Tunnel name': 'Имя туннеля', 'Name in client profiles': 'Имя в профилях клиентов', 'Name in panel': 'Имя в панели', 'Invalid panel name': 'Имя в панели должно содержать не более 64 символов без управляющих знаков',
    'Direct via eth0 ({name})': 'Напрямую через eth0 ({name})', 'Replace configuration (.conf)': 'Заменить конфигурацию (.conf)',
    'Failover:': 'Резервирование:', 'enabled': 'включено', 'disabled': 'выключено',
    'Include in failover': 'Добавить в резервирование', 'Lower numbers are preferred.': 'Чем меньше число, тем выше приоритет.',
    'This tunnel participates in failover (priority {priority}). Deleting it removes it from automatic switching.': 'Туннель сейчас участвует в резервировании (приоритет {priority}). После удаления он больше не будет использоваться для автоматического переключения.',
    'Reassign the clients pinned to this tunnel before deleting it.': 'Перед удалением выберите другой маршрут для клиентов, закреплённых за этим туннелем.',
    'Choose another default route before deleting this tunnel.': 'Перед удалением выберите другое направление в блоке «Маршрут по умолчанию».',
    'Change the routing rules that use this tunnel before deleting it.': 'Перед удалением измените направление в правилах маршрутизации, использующих этот туннель.',
    'Delete tunnel “{name}”?': 'Удалить туннель «{name}»?',
    'Its imported private configuration will be deleted.': 'Его импортированная приватная конфигурация будет удалена.',
    "Fixed route": "Фиксированный маршрут",
    "Automatic failover": "Автоматическое резервирование",
    "Route mode": "Режим маршрута",
    "For automatic clients when no routing rule matches.": "Для клиентов в автоматическом режиме, если ни одно правило маршрутизации не подошло.",
    "Chooses an available tunnel with the lowest priority number.": "Выбирается доступный туннель с наименьшим числом приоритета.",
    "Changes are not applied.": "Изменения не применены.",
    "Preferred: {name}": "Предпочтительный: {name}",
    "Currently used: {name}": "Сейчас используется: {name}",
    "Saved route: {name}": "Сохранённый маршрут: {name}",
    "Automatic return: on": "Автовозврат: включён",
    "Automatic return: off": "Автовозврат: выключен",
    "Priorities are not used in fixed mode.": "Приоритеты не используются в режиме фиксированного маршрута.",
    "Traffic exits directly through Server A.": "Трафик выходит через сервер A, минуя выходные туннели.",
    "Unmatched traffic is blocked.": "Трафик, не соответствующий правилам, блокируется.",
    "Traffic uses only {name}. If unavailable, traffic is blocked.": "Трафик идёт только через {name}. При недоступности туннеля трафик блокируется.",
    "Enable at least two tunnels with priorities": "Включите хотя бы два туннеля с заданным приоритетом",
    "Failover priorities must be unique": "Приоритеты резервирования должны быть уникальны",
    "Fewer than two eligible tunnels will remain. The route will become fixed on the remaining tunnel, or blocked if none remains.": "Останется меньше двух подходящих туннелей. Маршрут закрепится за оставшимся туннелем, а если его нет — будет заблокирован.",
    'Priority is already used by {0}': 'Этот приоритет уже используется туннелем {0}',
    'Some tunnels have the same saved priority. Assign different priorities to remove the tie.': 'У нескольких туннелей одинаковый сохранённый приоритет. Назначьте разные значения.',
    'Automatic return: {name}': 'Автовозврат: {name}',
    'Uses the selected direction for automatic clients when no routing rule matches. It does not switch tunnels.': 'Если ни одно правило не подошло, клиенты в автоматическом режиме используют выбранное направление. Туннели автоматически не переключаются.',
    'For automatic clients outside routing rules, switches to an available tunnel based on priority.': 'Если ни одно правило не подошло, для клиентов в автоматическом режиме система выбирает доступный туннель по приоритету.',
    'Operating mode': 'Режим работы',
    'Default': 'По умолчанию',
    'Change operating mode': 'Изменить режим работы', 'Change mode': 'Переключить',
    'Switch to the saved fixed route? Automatic failover will stop. Active connections may need to reconnect.': 'Перейти на сохранённый фиксированный маршрут? Автоматическое резервирование отключится. Активным соединениям может понадобиться переподключение.',
    'Enable automatic failover? The default route will be selected by tunnel priority and availability. Active connections may need to reconnect.': 'Включить автоматическое резервирование? Маршрут будет выбран по приоритету и доступности туннелей. Активным соединениям может понадобиться переподключение.',
    'About': 'О программе', 'Fork version': 'Версия форка', 'Base commit': 'Базовый коммит', 'Build commit': 'Коммит сборки', 'QR code': 'QR-код', 'Fork repository': 'Репозиторий форка', 'Original project': 'Исходный проект', 'AmneziaWG runtime': 'Версия AmneziaWG', 'Repository': 'Репозиторий', 'Project author': 'Автор проекта',
    "AWG Chain Easy is a web panel for managing a VPN gateway built on AmneziaWG 3, AmneziaWG 2 and WireGuard. It manages client profiles and routes traffic directly or through upstream tunnels using domain and IP rules and automatic failover.": "AWG Chain Easy — веб-панель для управления VPN-шлюзом на базе AmneziaWG 3, AmneziaWG 2 и WireGuard. В ней можно управлять клиентскими профилями и направлять трафик напрямую или через выходные туннели по правилам для доменов и IP, с автоматическим резервированием.",
    "AWG Chain Easy Mod adds:": "AWG Chain Easy Mod добавляет:",
    "Per-client routing: automatic, direct or through a specific upstream tunnel.": "Режим маршрутизации для каждого клиента: автоматический, прямой или через выбранный выходной туннель.",
    "One export window for configurations, vpn:// keys and QR codes, including the Amnezia format.": "Единое окно экспорта конфигураций, ключей vpn:// и QR-кодов, включая формат Amnezia.",
    "Persistent client and tunnel traffic statistics and saved client handshake times.": "Сохранение статистики трафика клиентов и туннелей, а также времени последнего обмена ключами у клиентов.",
    "A Russian and English interface with controls for DNS proxy, failover and export preferences.": "Интерфейс на русском и английском с настройками DNS-прокси, резервирования и формата экспорта.",
    'Enable routing policies before changing a rule': 'Для изменения правил сначала включите правила маршрутизации',

    'Backup DNS servers are used by the proxy on Server A. Clients pinned to B/C currently use only the first DNS server through their selected tunnel. Test DNS measures response times from Server A without changing the settings.': 'Резервные DNS работают в прокси A. Закреплённые за B/C клиенты пока используют первый DNS списка через свой туннель. Кнопка «Проверить DNS» измеряет время ответа с сервера A и не меняет настройки.',
    'Choose the format opened by the client QR button. Configuration QR (.conf) contains the native profile. Amnezia QR (vpn://) includes the server name and may cycle through several frames; scan all frames in Amnezia VPN.': 'Выберите формат, который открывается кнопкой QR у клиента. QR конфигурации (.conf) содержит обычный профиль. QR Amnezia (vpn://) передаёт также имя сервера и может состоять из сменяющихся кадров — в Amnezia VPN нужно отсканировать их все.',
    'Enter a valid IPv4 address (four numbers from 0 to 255).': 'Введите корректный IPv4-адрес: четыре числа от 0 до 255 через точку.', 'DNS addresses must be unique.': 'Адреса DNS не должны повторяться.', 'Testing…': 'Проверяется…', 'No response': 'Нет ответа', '{ms} ms': '{ms} мс',

    'Reset upstream traffic': 'Сбросить трафик туннелей', 'Reset traffic totals for ALL upstream tunnels? This clears accumulated traffic in the panel and cannot be undone here. Tunnel configurations, connections and handshake times are preserved. Active tunnels immediately start accumulating new traffic. Continue?': 'Сбросить накопленный трафик ВСЕХ выходных туннелей? Показания трафика в панели будут обнулены; отменить сброс в панели нельзя. Конфигурации, соединения и время обмена ключами сохранятся. Активные туннели сразу начнут накапливать новый трафик. Продолжить?', 'Traffic reset confirmation is required': 'Требуется подтверждение сброса трафика', 'Upstream statistics storage is unavailable': 'Хранилище статистики туннелей недоступно',
    'Settings': 'Настройки', 'Server name': 'Имя сервера', 'Save': 'Сохранить', 'Settings saved.': 'Настройки сохранены.',
    'Used in exported configurations, vpn:// keys and QR codes.': 'Используется при формировании конфигураций, ключей vpn:// и QR-кодов.',
    'DNS proxy': 'DNS-прокси', 'IPv4 address': 'IPv4-адрес', 'Add DNS server': 'Добавить DNS-сервер', 'Test DNS': 'Проверить DNS', 'Move up': 'Выше', 'Move down': 'Ниже', 'Remove': 'Убрать',
    'DNS servers are queried in order. A timeout or error tries the next server. A domain-not-found response does not trigger a retry.': 'DNS-серверы опрашиваются по порядку. При таймауте или ошибке используется следующий. Ответ «домен не существует» не вызывает переключение.',
    'Primary': 'Основной', 'Backup': 'Резервный', 'Testing DNS…': 'Проверка DNS…', '{address}: responds in {ms} ms': '{address}: ответ за {ms} мс', '{address}: no successful response': '{address}: успешный ответ не получен',
    'Failover parameters': 'Параметры резервирования', 'QR code format': 'Формат QR-кода',
    'Invalid settings': 'Некорректные настройки', 'Server name must contain 1-64 characters without control characters': 'Имя сервера должно содержать 1–64 символа без управляющих символов',
    'Specify 1-8 unique IPv4 DNS servers': 'Укажите от 1 до 8 уникальных IPv4-адресов DNS-серверов', 'Invalid QR format': 'Некорректный формат QR', 'DNS server cannot point to this VPN DNS proxy': 'Нельзя указать собственный адрес VPN DNS-прокси',

    'Automatic': 'Автоматически', 'Routing mode': 'Режим маршрутизации', 'Edit client': 'Изменить клиента', 'Save changes': 'Сохранить изменения',
    'Routing rules and B/C failover apply. DNS goes directly via Server A.': 'Применяются правила маршрутизации и резервирование B/C. DNS через A.',
    'All traffic and DNS go directly via Server A. Destination routing rules are ignored.': 'Весь трафик и DNS через A. Правила маршрутизации игнорируются.',
    'All traffic and DNS use only {name}. Destination rules and failover are ignored; access is blocked if this tunnel fails.': 'Весь трафик и DNS только через {name}. Правила маршрутизации не применяются. Автоматическое переключение на другие серверы отключено. При отказе этого туннеля доступ блокируется.',
    'Changing the routing mode may interrupt active connections. No profile reimport is needed.': 'Смена режима может прервать активные соединения. Повторный импорт профиля не требуется.',
    'Selected client upstream does not exist': 'Выбранный туннель клиента не существует', 'Client protocol cannot be changed': 'Протокол существующего клиента изменить нельзя',
    'Upstream is assigned to a client': 'Туннель назначен клиенту; сначала измените его режим',
    'Unable to apply failover routing; another check will retry.': 'Не удалось применить резервный маршрут; следующая проверка повторит попытку.', 'Online': 'Онлайн', 'Delete upstream': 'Удалить туннель', 'Delete routing policy': 'Удалить правило', 'Enable routing policies': 'Включить правила', 'Disable routing policies': 'Выключить правила', 'Routing policies are enabled': 'Правила маршрутизации включены', 'Routing policies are disabled': 'Правила маршрутизации выключены', 'Switching policies may interrupt automatic-mode client connections. Individual rule settings are preserved.': 'Переключение может прервать соединения клиентов в автоматическом режиме. Индивидуальные настройки правил сохраняются.', 'Clients': 'Клиенты', 'Routing': 'Маршрутизация', 'Sign out': 'Выйти',
    'Primary navigation': 'Основная навигация', 'Interface language': 'Язык интерфейса',
    'Administrator sign in': 'Вход администратора', 'Use the password configured for this server.': 'Введите пароль, настроенный для этого сервера.',
    'Password': 'Пароль', 'Sign in': 'Войти', 'New client': 'Новый клиент',
    'Manage AWG3, legacy AWG2, and native WireGuard access profiles and connection state.': 'Управление профилями AWG3, AWG2 и WireGuard, подключениями и передачей данных.',
    'Server status': 'Состояние сервера', 'Tunnel': 'Туннель', 'Running': 'Работает', 'AmneziaWG server': 'Сервер AmneziaWG',
    'Endpoint': 'Адрес подключения', 'Connected': 'Подключено', 'Name': 'Имя', 'Protocol': 'Протокол', 'Address': 'Адрес',
    'Status': 'Состояние', 'Latest handshake': 'Последний обмен ключами', 'Transfer': 'Трафик', 'Actions': 'Действия',
    'The next free address is assigned automatically.': 'Следующий свободный адрес назначается автоматически.',
    'Cancel': 'Отмена', 'AWG2 (legacy/mobile)': 'AWG2 (для мобильных устройств)', 'WireGuard (native)': 'WireGuard (обычный)',
    'Create client': 'Создать клиента', 'Access profiles': 'Профили доступа', 'Waiting for server data.': 'Ожидание данных сервера.',
    'Delete client': 'Удалить клиента', 'Reset statistics': 'Сбросить статистику', 'Reset': 'Сброс', 'Reset traffic totals and last handshake for ALL clients? This clears the displayed statistics; undo is not available in the panel. Keys, profiles and VPN connections will remain unchanged. Active clients will immediately start accumulating new statistics. Continue?': 'Сбросить трафик и время последнего обмена ключами у ВСЕХ клиентов? Отображаемая статистика будет очищена; отменить сброс в панели нельзя. Ключи, профили и VPN-соединения сохранятся. Активные клиенты сразу начнут накапливать новую статистику. Продолжить?', 'Statistics reset confirmation is required': 'Необходимо подтвердить сброс статистики', 'Client statistics storage is unavailable': 'Хранилище статистики клиентов недоступно', 'Refresh': 'Обновить', 'No clients configured.': 'Клиенты ещё не созданы.', 'Create first client': 'Создать первого клиента',
    'Destination routing': 'Маршрутизация трафика', 'Route domains and IPv4 networks directly, through an upstream AWG tunnel, or block them.': 'Направляйте домены и IPv4-сети напрямую, через выходной AWG-туннель или блокируйте их.',
    'Import upstream': 'Импорт туннеля', 'New policy': 'Новое правило', 'Routing status': 'Состояние маршрутизации',
    'DNS policy': 'DNS-прокси', 'Resolver': 'DNS-сервер', 'Upstreams': 'Выходные туннели', 'Policies': 'Правила',
    'Default route': 'Маршрут по умолчанию', 'Used when no enabled destination policy matches. With failover enabled, the selected failover upstream handles this traffic.': 'Используется, если ни одно включённое правило не подошло. При резервировании трафик идёт через выбранный резервный туннель.',
    'Destination': 'Направление', 'Save default': 'Сохранить маршрут', 'Default-route failover': 'Резервирование основного маршрута',
    'Disabled': 'Выключено', 'Enabled': 'Включено', 'Use higher priority': 'Выбрать более высокий приоритет',
    'Failover health checks': 'Проверки резервных туннелей', 'Upstream': 'Выходной туннель', 'Failover priority': 'Приоритет резервирования',
    'Health': 'Доступность', 'Last checked': 'Последняя проверка', 'Last successful check': 'Последняя успешная проверка',
    'Configure failover': 'Настроить резервирование', 'Enable automatic failover': 'Включить автоматическое переключение',
    'Lower numbers are preferred. Equal-priority upstreams are interchangeable; the current choice stays selected while it works. Destination policies keep their selected routes.': 'Меньшее число означает более высокий приоритет. Туннели с одинаковым приоритетом взаимозаменяемы; рабочий туннель сохраняется. Маршруты отдельных правил не меняются.',
    'Set priorities in the': 'Задайте приоритеты в', 'Upstreams list': 'списке выходных туннелей',
    '. Include at least two upstreams, including the saved default, and enable their tunnels. A blank priority excludes an upstream from failover.': '. Добавьте хотя бы два туннеля, включая основной, и включите их. Пустой приоритет исключает туннель из резервирования.',
    'Check interval (seconds)': 'Интервал проверки (сек.)', 'Probe timeout (seconds)': 'Таймаут проверки (сек.)',
    'Failures before switching': 'Ошибок до переключения', 'Successes before recovery': 'Успехов до восстановления',
    'HTTPS health-check URLs (one per line)': 'HTTPS-адреса проверки (по одному в строке)',
    'One to three URLs. Any successful 2xx response passes the check; redirects do not. All included upstreams are checked.': 'От одного до трёх адресов. Любой ответ 2xx считается успешным; перенаправления — нет. Проверяются все участвующие туннели.',
    'Automatically return to a higher priority after recovery': 'Возвращаться к более высокому приоритету после восстановления',
    'If no candidate is usable, new default-route traffic is blocked. With automatic return off, a working upstream stays selected until it fails or you choose “Use higher priority”. Existing connections may need to reconnect after a switch.': 'Если доступных туннелей нет, новые соединения основного маршрута блокируются. Без автоматического возврата рабочий туннель сохраняется до сбоя или ручного выбора. После переключения может потребоваться переподключение.',
    'Save failover': 'Сохранить резервирование', 'Import upstream AWG config': 'Импорт выходного AWG-туннеля',
    'AWG3 and legacy AWG profiles are supported; executable directives are rejected.': 'Поддерживаются AWG3 и прежние версии AWG; исполняемые команды в конфигурации запрещены.',
    'Config file': 'Файл конфигурации', 'Configuration': 'Конфигурация', 'An optional': 'Необязательный комментарий',
    "comment sets this upstream's failover priority. You can also set it after import.": 'задаёт приоритет резервирования. Его можно изменить и после импорта.',
    'Fixed local UDP port (optional)': 'Фиксированный локальный UDP-порт (необязательно)', 'Keep imported port': 'Сохранить порт из файла',
    'Use a published port when the upstream initiates connections.': 'Для входящих подключений от удалённого сервера используйте опубликованный порт.',
    'Import and start': 'Импортировать и запустить', 'Upstream tunnels': 'Выходные туннели',
    'Each upstream has an isolated network namespace, so configs can share tunnel addresses.': 'Каждый туннель изолирован в своём сетевом пространстве, поэтому адреса туннелей могут совпадать.',
    'Interface': 'Интерфейс', 'Connection': 'Подключение', 'Handshake': 'Обмен ключами', 'No upstream tunnels configured.': 'Выходные туннели ещё не настроены.',
    'New destination policy': 'Новое правило маршрутизации', 'Lower priority numbers are evaluated first.': 'Правила с меньшим числом приоритета проверяются первыми.',
    'Priority': 'Приоритет', 'Domains': 'Домены', 'IPv4 networks': 'IPv4-сети', 'Create policy': 'Создать правило',
    'Routing policies': 'Правила маршрутизации', 'Domain results are added with DNS TTL-based expiration.': 'Полученные IP-адреса доменов действуют в течение DNS TTL.',
    'Matches': 'Условия', 'No destination policies configured.': 'Правила маршрутизации ещё не настроены.',
    'Peer connection': 'Подключение к клиенту', 'Close': 'Закрыть',
    'Initiate the tunnel from this server when the remote peer cannot reach it directly.': 'Инициируйте туннель с этого сервера, если удалённая сторона не может подключиться напрямую.',
    'Initiate connections to this peer': 'Инициировать подключения к этому клиенту', 'Remote endpoint': 'Удалённый адрес подключения',
    "Use the remote peer's published UDP port.": 'Укажите опубликованный UDP-порт удалённой стороны.',
    'Keepalive (seconds)': 'Keepalive (сек.)', 'Save connection': 'Сохранить подключение',
    'Upstream failover priority': 'Приоритет выходного туннеля', 'Excluded': 'Исключён',
    'Lower numbers are preferred. Equal numbers share a priority group. Leave blank to exclude this upstream.': 'Меньшее число означает более высокий приоритет. Одинаковые числа образуют одну группу. Пустое поле исключает туннель из резервирования.',
    'Changing priority keeps the tunnel running. Downloaded configs include the current priority as a comment.': 'Изменение приоритета не перезапускает туннель. При скачивании приоритет добавляется в конфигурацию как комментарий.',
    'Save priority': 'Сохранить приоритет', 'Upstream listen port': 'Порт выходного туннеля', 'Fixed local UDP port': 'Фиксированный локальный UDP-порт',
    'Automatic': 'Автоматически', "Changing this port briefly restarts this upstream. Update the remote peer's endpoint to match. Leave blank for automatic allocation.": 'Изменение порта кратковременно перезапускает этот туннель. Обновите адрес на удалённой стороне. Оставьте поле пустым для автоматического выбора.',
    'Save port': 'Сохранить порт', 'Client config': 'Конфигурация клиента', 'Loading configuration…': 'Загрузка конфигурации…',
    'Client configuration': 'Конфигурация клиента', 'Client QR code': 'QR-код клиента',
    'Scan with a client compatible with the selected protocol.': 'Сканируйте приложением, поддерживающим выбранный протокол.',
    'Client configuration QR code': 'QR-код конфигурации клиента',
    'Configuration QR (.conf)': 'QR конфигурации (.conf)', 'Amnezia QR (vpn://)': 'QR Amnezia (vpn://)', 'Scan all changing QR codes to import the connection.': 'Для импорта подключения отсканируйте все сменяющиеся QR-коды.', 'QR {current} of {total}': 'QR {current} из {total}', 'Loading QR codes…': 'Загрузка QR-кодов…', 'Includes the server name for Amnezia import.': 'Содержит имя сервера для импорта в Amnezia.', 'Amnezia connection QR code': 'QR-код подключения Amnezia',
    'Never': 'Никогда', '{n}s ago': '{n} сек. назад', '{n}m ago': '{n} мин. назад', '{n}h ago': '{n} ч. назад', '{n}d ago': '{n} дн. назад',
    'B': 'Б', 'KiB': 'КиБ', 'MiB': 'МиБ', 'GiB': 'ГиБ', 'Port': 'Порт', 'Download': 'Скачать', 'Download .vpn': 'Скачать .vpn',
    'Config (.conf)': 'Конфиг (.conf)', 'Key (vpn://)': 'Ключ (vpn://)', 'Copy': 'Скопировать', 'Copied': 'Скопировано', 'Could not copy. Select and copy the text manually.': 'Не удалось скопировать. Выделите и скопируйте текст вручную.', 'View .cfg': 'Просмотр .cfg', 'View vpn://': 'Просмотр vpn://', 'Rename': 'Переименовать', 'Rename client': 'Переименовать клиента', 'Save name': 'Сохранить имя', 'Client renamed.': 'Клиент переименован.', 'View': 'Просмотр', 'Disable': 'Выключить', 'Enable': 'Включить', 'Delete': 'Удалить', 'Edit': 'Изменить',
    'Direct': 'Напрямую', 'Blocked': 'Заблокировано', 'Missing upstream': 'Туннель не найден', 'Direct via eth0 (Server A)': 'Напрямую через eth0 (Server A)',
    'Upstream: {name}{status}': 'Туннель: {name}{status}', 'up': 'работает', 'down': 'остановлен', 'disabled': 'выключен', 'error': 'ошибка',
    'Awaiting': 'Ожидание', 'Idle': 'Нет активности', 'Stale': 'Нет свежего handshake', 'Unknown': 'Неизвестно', 'Unavailable': 'Недоступен',
    'A recent authenticated handshake succeeded. Traffic forwarding is not actively probed.': 'Недавний handshake успешен. Передача трафика отдельно не проверяется.',
    'No handshake yet. An idle tunnel may wait for traffic.': 'Handshake ещё не было. Туннель может ожидать трафик.',
    'The previous handshake is old; keepalive is off, so inactivity does not establish a failure.': 'Последний handshake был давно; keepalive выключен, поэтому отсутствие активности не означает сбой.',
    'No recent handshake despite enabled keepalives. Check reachability and the peer configuration.': 'Нет свежего handshake при включённом keepalive. Проверьте доступность и настройки удалённой стороны.',
    'The running interface did not provide readable peer status.': 'Не удалось прочитать состояние удалённой стороны у работающего интерфейса.',
    'This upstream is disabled.': 'Выходной туннель выключен.', 'The upstream interface is not running.': 'Интерфейс выходного туннеля не работает.',
    'Configured published UDP ports: {ports}. Apply Compose changes before using a new range.': 'Настроенные опубликованные UDP-порты: {ports}. Перед использованием нового диапазона примените изменения Compose.',
    'Published port range is unavailable.': 'Нет данных о диапазоне опубликованных портов.',
    '{hint} Leave blank to preserve the imported setting.': '{hint} Оставьте поле пустым, чтобы сохранить значение из файла.',
    'Listen port: {name}': 'Порт: {name}', 'Failover priority: {name}': 'Приоритет резервирования: {name}',
    'Delete upstream “{name}”? Its imported private config will be removed.': 'Удалить туннель «{name}»? Его импортированная приватная конфигурация будет удалена.',
    '{protocol} · {interface} / table {table}': '{protocol} · {interface} / таблица {table}',
    'Local UDP {port}{mode}': 'Локальный UDP {port}{mode}', ' · fixed': ' · фиксированный', ' · automatic': ' · автоматический',
    ' · outside published range': ' · вне опубликованного диапазона', 'Edit failover priority for {name}': 'Изменить приоритет резервирования: {name}',
    'Domains: {domains}, networks: {networks}': 'Доменов: {domains}, сетей: {networks}',
    'Delete routing policy “{name}”?': 'Удалить правило «{name}»?', 'Not selected': 'Не выбран',
    'Traffic blocked — no usable selected upstream': 'Трафик заблокирован — выбранный туннель недоступен',
    'Using {name} · priority {priority}': 'Используется {name} · приоритет {priority}', 'Not yet checked': 'Ещё не проверялся',
    'Retrying ({n}/{total})': 'Повторная проверка ({n}/{total})', 'Checking ({n}/{total})': 'Проверка ({n}/{total})',
    'Healthy': 'Доступен', 'Unhealthy': 'Недоступен', 'Checking': 'Проверяется', ' (selected)': ' (выбран)', 'Never succeeded': 'Успешных проверок не было',
    'Connection: {name}': 'Подключение: {name}', 'Config: {name}': 'Конфигурация: {name}', 'QR code: {name}': 'QR-код: {name}',
    'Initiates to {endpoint}; keepalive {seconds}s': 'Подключается к {endpoint}; keepalive {seconds} сек.',
    'Delete client “{name}”? This permanently removes its private key.': 'Удалить клиента «{name}»? Его приватный ключ будет безвозвратно удалён.',
    'Updated {time}': 'Обновлено {time}', 'Edit destination policy': 'Изменение правила маршрутизации', 'Save policy': 'Сохранить правило',
    'Request failed ({status})': 'Ошибка запроса ({status})', 'Not authenticated': 'Требуется вход', 'Invalid password': 'Неверный пароль',
    'Invalid credentials': 'Неверный пароль', 'Too many login attempts': 'Слишком много попыток входа',
    'Incorrect password': 'Неверный пароль', 'Too many login attempts; try again later': 'Слишком много попыток входа; повторите позже',
    'Client name already exists': 'Клиент с таким именем уже существует',
    'Name must contain 1-64 characters': 'Имя должно содержать от 1 до 64 символов',
    'Client not found': 'Клиент не найден', 'Internal server error': 'Внутренняя ошибка сервера',
    'Direct via server A': 'Напрямую через сервер A',
    'Failed to fetch': 'Не удалось связаться с сервером', 'Invalid request origin': 'Недопустимый источник запроса',
  };
  Object.assign(ru, {"A higher-priority upstream must pass fresh recovery checks before switching back": "Перед возвратом приоритетный туннель должен пройти новые проверки восстановления", "AWG 3 requires S1-S4 to be at least 12": "Для AWG3 значения S1–S4 должны быть не меньше 12", "AWG 3.1 toggles must be on or off": "Параметры AWG3.1 должны иметь значение on или off", "Cannot check reserved ports: repair or delete the unreadable upstream configuration first.": "Нельзя проверить занятые порты: исправьте или удалите нечитаемую конфигурацию туннеля", "Clear this upstream’s failover priority before deleting it": "Перед удалением уберите приоритет резервирования этого туннеля", "Client egress must be default, direct, or upstream": "Режим клиента должен быть default, direct или upstream", "Client traffic counter overflow": "Переполнение счётчика трафика клиента", "Configure one to three HTTPS probe URLs": "Укажите от одного до трёх HTTPS-адресов проверки", "Configure up to eight failover candidates": "Можно выбрать не более восьми резервных туннелей", "DNS client closed": "DNS-клиент закрыл соединение", "DNS proxy stopped": "DNS-прокси остановлен", "DNS request limit reached": "Достигнут лимит DNS-запросов", "DNS upstream closed": "DNS-сервер закрыл соединение", "DNS upstream must be IPv4": "DNS-сервер должен иметь IPv4-адрес", "DNS upstream response too large": "Слишком большой ответ DNS-сервера", "DNS upstream timeout": "Истекло время ожидания DNS-сервера", "DNS_TTL_MIN must not exceed DNS_TTL_MAX": "DNS_TTL_MIN не должен превышать DNS_TTL_MAX", "DNS_UPSTREAM must be an IPv4 address": "DNS_UPSTREAM должен содержать IPv4-адрес", "Disable failover before choosing Direct or Blocked as the default route": "Отключите резервирование, прежде чем выбирать «Напрямую» или «Заблокировано» в качестве основного маршрута", "Each candidate needs an upstreamId and priority": "Для каждого кандидата нужны идентификатор туннеля и приоритет", "Each upstream may appear only once in failover candidates": "Туннель нельзя добавлять в резервирование несколько раз", "Existing wg0.json is not an AWG 3 state file; migrate it manually or use an empty CONFIG_DIR": "Файл wg0.json не соответствует AWG3: выполните миграцию или используйте пустой CONFIG_DIR", "Failover priority must be an integer between 1 and 10000": "Приоритет резервирования должен быть целым числом от 1 до 10000", "Failover priority must be an integer between 1 and 10000, or null to exclude the upstream": "Укажите приоритет от 1 до 10000 либо null для исключения туннеля", "Failover settings must be an object": "Неверный формат настроек резервирования", "Fixed listen port must be in UPSTREAM_PORT_RANGE; update the Compose deployment to publish other ports": "Фиксированный порт должен входить в UPSTREAM_PORT_RANGE; для других портов измените публикацию в Compose", "IPv4 forwarding is disabled in new network namespaces; enable forwarding on the Docker host and recreate the container": "IPv4-пересылка отключена в новых сетевых пространствах: включите её на Docker-хосте и пересоздайте контейнер", "Include the saved default upstream in failover candidates": "Добавьте сохранённый основной туннель в список резервирования", "Incomplete peer status": "Неполная статистика соединения", "Incomplete profile": "Неполная конфигурация профиля", "Invalid DNS frame": "Некорректный DNS-фрейм", "Invalid DNS packet": "Некорректный DNS-пакет", "Invalid HTTPS probe URL": "Некорректный HTTPS-адрес проверки", "Invalid IPv4 transit exclusion": "Некорректное исключение транзитной IPv4-сети", "Invalid JSON": "Некорректный JSON", "Invalid client IPv4 address": "Некорректный IPv4-адрес клиента", "Invalid client statistics entry": "Некорректная запись статистики клиента", "Invalid client statistics file": "Некорректный файл статистики клиентов", "Invalid direct client IPv4 address": "Некорректный IPv4-адрес прямого клиента", "Invalid handshake history format": "Некорректный формат истории обмена ключами", "Invalid profile": "Некорректный профиль", "Invalid proxy address": "Некорректный адрес прокси", "Invalid proxy address chain": "Некорректная цепочка адресов прокси", "Invalid upstream configuration syntax": "Ошибка синтаксиса конфигурации туннеля", "Listen port must be an integer between 0 and 65535": "Порт должен быть целым числом от 0 до 65535", "Listen port must be between 0 and 65535": "Порт должен быть от 0 до 65535", "Login is busy; try again later": "Сервис входа занят; повторите позже", "Method not allowed": "Метод запроса не поддерживается", "Missing AWG3 header protection": "Отсутствует параметр защиты заголовка AWG3", "Native WireGuard server identity is missing": "Отсутствуют ключи сервера WireGuard", "No available IPv4 addresses remain in this client pool.": "В пуле клиентов не осталось свободных IPv4-адресов", "No non-overlapping private transit subnet is available for this upstream": "Не найдена свободная непересекающаяся транзитная подсеть", "Not found": "Не найдено", "PASSWORD_HASH must contain a bcrypt hash": "PASSWORD_HASH должен содержать bcrypt-хеш", "Password verification is unavailable": "Проверка пароля недоступна", "Password verification timed out": "Истекло время проверки пароля", "Peer endpoint must be an IP address or hostname with a valid UDP port": "Укажите IP-адрес или имя узла с допустимым UDP-портом", "Policy name must contain 1-64 characters": "Имя правила должно содержать от 1 до 64 символов", "Policy not found": "Правило не найдено", "Policy priority is already used": "Этот приоритет уже занят другим правилом", "Policy priority must be between 1 and 10000": "Приоритет правила должен быть от 1 до 10000", "Policy requires at least one domain or IPv4 network": "Добавьте хотя бы один домен или IPv4-сеть", "Probe URLs must use HTTPS with an IPv4 address or hostname, without credentials or fragments": "Адрес проверки должен быть HTTPS с IPv4 или именем узла, без данных входа и фрагмента", "Probe targets must be HTTPS URLs of at most 2048 characters": "Укажите HTTPS-адреса проверки длиной до 2048 символов", "Probe timeout must not exceed the check interval": "Тайм-аут проверки не должен превышать интервал", "Protocol must be AWG3, AWG2, or WG": "Выберите протокол AWG3, AWG2 или WG", "RandomTrailers requires equal S1-S4 in this deployment": "Для RandomTrailers в этой конфигурации требуются одинаковые S1–S4", "Request body is too large": "Слишком большой размер запроса", "Request body timed out": "Истекло время получения запроса", "Require AWG2_JMIN <= AWG2_JMAX < WG_MTU": "Необходимо AWG2_JMIN ≤ AWG2_JMAX < WG_MTU", "Require JMIN <= JMAX < WG_MTU": "Необходимо JMIN ≤ JMAX < WG_MTU", "Reverse initiation requires an endpoint and keepalive interval": "Для обратной инициации укажите адрес и интервал keepalive", "Reverse keepalive must be an integer between 1 and 65535 seconds": "Интервал keepalive должен быть целым числом от 1 до 65535 секунд", "Route type must be direct, blocked, or upstream": "Тип маршрута должен быть direct, blocked или upstream", "Routing shutdown could not complete; forwarding guards were retained": "Завершение маршрутизации не выполнено; защитные правила сохранены", "Select an existing backup upstream": "Выберите существующий резервный туннель", "Select an existing candidate upstream": "Выберите существующий туннель-кандидат", "Select an existing upstream as the default route before enabling failover": "Перед включением резервирования выберите туннель основным маршрутом", "Select at least two failover candidates": "Выберите не менее двух туннелей для резервирования", "Selected upstream does not exist": "Выбранный туннель не существует", "Too many active sessions": "Слишком много активных сессий", "UPSTREAM_PORT_RANGE must be a port or a consecutive range": "UPSTREAM_PORT_RANGE должен содержать порт или последовательный диапазон", "UPSTREAM_PORT_RANGE must contain 1-8 ports between 1 and 65535": "UPSTREAM_PORT_RANGE должен содержать 1–8 портов в пределах 1–65535", "UPSTREAM_PORT_RANGE must not overlap inbound UDP ports or DNS port 53": "Диапазон upstream-портов не должен пересекать входящие UDP-порты и DNS-порт 53", "Unable to apply direct client routing and pinned upstreams": "Не удалось применить индивидуальные маршруты клиентов", "Unable to apply upstream configuration; check its AWG parameters and listen port": "Не удалось применить конфигурацию туннеля: проверьте параметры AWG и порт", "Unable to clear previous client connections": "Не удалось очистить прежние соединения клиента", "Unable to create upstream namespace; verify SYS_ADMIN capability and namespace support": "Не удалось создать сетевое пространство туннеля: проверьте SYS_ADMIN и поддержку namespaces", "Unable to guard downstream forwarding during routing initialization or shutdown": "Не удалось защитить клиентскую пересылку при запуске или остановке", "Unable to stop owned upstream process": "Не удалось остановить процесс туннеля", "Unable to update the default route": "Не удалось обновить основной маршрут", "Unsupported export protocol": "Неподдерживаемый протокол экспорта", "Unsupported routing.json format": "Неподдерживаемый формат routing.json", "Upstream Endpoint must be an IPv4 address or hostname plus a valid port": "Endpoint туннеля должен содержать IPv4-адрес или имя узла и допустимый порт", "Upstream MTU is invalid": "Некорректный MTU туннеля", "Upstream config Peer AllowedIPs must include 0.0.0.0/0": "AllowedIPs в Peer туннеля должен включать 0.0.0.0/0", "Upstream config must contain 80-131072 characters": "Конфигурация туннеля должна содержать 80–131072 символа", "Upstream config must contain exactly one [Peer] section": "Конфигурация туннеля должна содержать ровно одну секцию [Peer]", "Upstream config requires an IPv4 Interface Address": "Укажите IPv4-адрес в Interface Address туннеля", "Upstream configuration was rejected by awg-quick": "Конфигурация туннеля отклонена awg-quick", "Upstream is used by a routing policy": "Туннель используется правилом маршрутизации", "Upstream is used by the default route": "Туннель используется основным маршрутом", "Upstream listen port conflicts with an inbound UDP listener": "Порт туннеля совпадает с входящим UDP-портом", "Upstream listen port is already reserved by another upstream": "Порт уже занят другим туннелем", "Upstream name already exists": "Туннель с таким именем уже существует", "Upstream name must contain 1-64 characters": "Имя туннеля должно содержать от 1 до 64 символов", "Upstream namespace identity changed": "Сетевое пространство туннеля изменилось", "Upstream namespace is unavailable": "Сетевое пространство туннеля недоступно", "Upstream namespace was not isolated": "Сетевое пространство туннеля не изолировано", "Upstream not found": "Туннель не найден", "Upstream userspace daemon failed to start": "Не удалось запустить процесс туннеля", "Use # FailoverPriority = 20, or omit the comment to exclude the upstream": "Используйте # FailoverPriority = 20 или уберите комментарий для исключения туннеля", "Use candidates instead of backupUpstreamId": "Используйте candidates вместо backupUpstreamId", "Use only one FailoverPriority comment": "Допустим только один комментарий FailoverPriority", "VPN control socket is unavailable": "Управляющий сокет VPN недоступен", "WEBUI_HTTPS must be true or false": "WEBUI_HTTPS должен иметь значение true или false", "WG_DEFAULT_ADDRESS, AWG2_DEFAULT_ADDRESS, and NATIVE_WG_DEFAULT_ADDRESS must use different /24 networks": "WG_DEFAULT_ADDRESS, AWG2_DEFAULT_ADDRESS и NATIVE_WG_DEFAULT_ADDRESS должны использовать разные сети /24", "WG_HOST is required": "Необходимо указать WG_HOST", "WG_PORT, AWG2_PORT, and NATIVE_WG_PORT must be different": "WG_PORT, AWG2_PORT и NATIVE_WG_PORT должны различаться", "failoverPriority is required; use null to exclude the upstream": "Укажите failoverPriority; null исключает туннель из резервирования", "listenPort is required; use 0 for automatic allocation": "Укажите listenPort; 0 означает автоматический выбор", "reverseInitiation is required; use null to disable": "Укажите reverseInitiation; null отключает обратную инициацию", "Policies enabled must be a boolean": "Состояние правил должно быть логическим значением", "Unable to apply routing policy switch": "Не удалось переключить применение правил маршрутизации", "Cannot read saved upstream port": "Не удалось прочитать сохранённый порт туннеля", "Upstream namespace link is unavailable": "Сетевая связь с пространством туннеля недоступна"});
  const errorTranslations = [[ "^Priority is already used by (.+)$", "Этот приоритет уже используется туннелем {0}"], ["^(.+) is forbidden in imported upstream configs$", "Параметр {0} запрещён в импортируемой конфигурации"], ["^(.+) must be a boolean$", "Параметр {0} должен быть логическим значением"], ["^(.+) must be an integer between (.+) and (.+)$", "Параметр {0} должен быть целым числом от {1} до {2}"], ["^(.+) must be between (.+) and (.+)$", "Параметр {0} должен быть от {1} до {2}"], ["^(.+) must be an IPv4 /24 template such as 10.8.3.x$", "Параметр {0} должен быть IPv4-шаблоном /24, например 10.8.3.x"], ["^AWG 3 requires (.+) to be at least 12$", "Для AWG3 параметр {0} должен быть не меньше 12"], ["^AWG 3 upstream config is missing Interface (.+)$", "В секции Interface AWG3 отсутствует {0}"], ["^At most (.+) upstreams are supported$", "Поддерживается не более {0} выходных туннелей"], ["^Invalid IPv4 network: (.+)$", "Некорректная IPv4-сеть: {0}"], ["^Invalid domain: (.+)$", "Некорректный домен: {0}"], ["^Legacy AWG upstream (.+) must be an unsigned integer$", "Параметр {0} прежнего AWG должен быть целым неотрицательным числом"], ["^UAPI socket did not appear for (.+)$", "Не появился управляющий сокет интерфейса {0}"], ["^Unable to add DNS route for (.+): (.+)$", "Не удалось добавить DNS-маршрут для {0}: {1}"], ["^Unable to start upstream: (.+)$", "Не удалось запустить туннель: {0}"], ["^Unable to update upstream listen port: (.+)$", "Не удалось изменить порт туннеля: {0}"], ["^Unknown failover setting: (.+)$", "Неизвестная настройка резервирования: {0}"], ["^Unsupported config section: (.+)$", "Неподдерживаемая секция конфигурации: {0}"], ["^Upstream config is missing Interface (.+)$", "В секции Interface туннеля отсутствует {0}"], ["^Upstream config is missing Peer (.+)$", "В секции Peer туннеля отсутствует {0}"], ["^Upstream namespace command failed: (.+)$", "Ошибка команды в пространстве туннеля: {0}"], ["^Upstream network command failed: (.+)$", "Ошибка сетевой команды туннеля: {0}"], ["^nft reconciliation failed: (.+)$", "Не удалось применить nft-правила: {0}"], ["^(.+) failed: (.+)$", "Ошибка выполнения {0}: {1}"]];
  const storageKey = 'awg-chain-easy.language';
  let language = 'ru';
  try { const saved = localStorage.getItem(storageKey); if (saved === 'ru' || saved === 'en') language = saved; } catch (_) { /* Storage may be unavailable. */ }
  const t = (key, values = {}) => {
    const requestError = /^Request failed \((\d+)\)$/.exec(key);
    if (requestError) { key = 'Request failed ({status})'; values = { status: requestError[1] }; }
    if (language === 'ru' && !ru[key]) {
      for (const [pattern, replacement] of errorTranslations) {
        const match = new RegExp(pattern).exec(key);
        if (match) return replacement.replace(/\{(\d+)\}/g, (_, index) => t(match[Number(index) + 1]));
      }
    }
    return (language === 'ru' ? ru[key] || key : key).replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
  };
  const staticNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.parentElement?.tagName)) continue;
    const key = node.nodeValue.trim(); if (key && ru[key]) staticNodes.push({ node, raw: node.nodeValue, key });
  }
  const attributes = [];
  for (const node of document.querySelectorAll('[aria-label], [placeholder], [title], [alt]')) {
    for (const attr of ['aria-label', 'placeholder', 'title', 'alt']) {
      const key = node.getAttribute(attr); if (ru[key]) attributes.push({ node, attr, key });
    }
  }
  const labels = new Map();
  const text = (node, key, values = {}) => { labels.set(node, { key, values }); node.textContent = t(key, values); };
  function apply() {
    document.documentElement.lang = language;
    for (const { node, raw, key } of staticNodes) if (node.isConnected) node.nodeValue = raw.replace(key, t(key));
    for (const { node, attr, key } of attributes) node.setAttribute(attr, t(key));
    for (const [node, { key, values }] of labels) if (node.isConnected) node.textContent = t(key, values);
    for (const node of document.querySelectorAll('[data-language]')) node.setAttribute('aria-pressed', String(node.dataset.language === language));
  }
  function setLanguage(value) {
    if (!['ru', 'en'].includes(value)) return;
    language = value; try { localStorage.setItem(storageKey, value); } catch (_) { /* Use in-memory selection. */ }
    apply(); window.dispatchEvent(new Event('awg-language-change'));
  }
  window.I18N = { t, text, setLanguage, get language() { return language; }, get locale() { return language === 'ru' ? 'ru-RU' : 'en-GB'; } };
  for (const node of document.querySelectorAll('[data-language]')) node.addEventListener('click', () => setLanguage(node.dataset.language));
  apply();
})();

'use strict';

const { t, text } = window.I18N;

const elements = Object.fromEntries([
  'confirm-action-dialog', 'confirm-action-title', 'confirm-action-message', 'confirm-action-cancel', 'confirm-action-accept', 'login-view', 'app-view', 'logout-button', 'login-form', 'password', 'login-error',
  'new-client-button', 'create-panel', 'cancel-create-button', 'create-form', 'client-name', 'client-protocol',
  'create-error', 'page-message', 'endpoint-value', 'client-count', 'connected-count', 'amneziawg-version',
  'client-rows', 'empty-state', 'empty-create-button', 'refresh-button', 'reset-statistics-button', 'upstreams-refresh', 'reset-upstream-statistics', 'last-updated',
  'qr-dialog', 'qr-title', 'qr-image', 'qr-vpn-image', 'qr-vpn-status', 'qr-conf-panel', 'qr-amnezia-panel',  'close-qr-button',
  'rename-dialog', 'rename-title', 'close-rename', 'rename-form', 'rename-name', 'rename-route', 'rename-route-hint', 'client-route', 'client-route-hint', 'rename-error', 'rename-save', 'config-copy', 'config-vpn-text', 'config-download', 'config-dialog', 'config-title', 'config-text', 'config-loading', 'config-error', 'close-config-button',
  'peer-connection-dialog', 'peer-connection-title', 'close-peer-connection', 'peer-connection-form',
  'peer-connection-enabled', 'peer-connection-fields', 'peer-connection-endpoint', 'peer-connection-keepalive', 'peer-connection-error',
  'upstream-listen-port', 'upstream-port-hint',
  'primary-nav', 'clients-page', 'routing-page', 'settings-page', 'about-page', 'about-version', 'about-commit', 'about-build-commit', 'about-awg', 'server-settings-form', 'settings-server-name', 'settings-panel-name', 'server-settings-message', 'dns-settings-form', 'dns-settings-rows', 'dns-settings-message', 'dns-add', 'dns-test', 'qr-settings-form', 'settings-qr-format', 'qr-settings-message', 'new-upstream-button', 'new-policy-button',
  'dns-status', 'dns-upstream', 'upstream-count', 'policy-count',
  'default-route-form', 'default-route', 'default-route-error',
  'failover-status', 'failover-runtime-error', 'failover-settings', 'failover-form', 'failover-fields',
  'failover-interval', 'failover-timeout', 'failover-failures',
  'failover-recovery', 'failover-targets', 'failover-auto-return', 'failover-error', 'failover-return',
  'upstream-create-panel', 'cancel-upstream-button', 'upstream-form', 'upstream-name',
  'upstream-file', 'upstream-config', 'upstream-error', 'upstream-rows', 'upstream-empty',
  'policy-create-panel', 'cancel-policy-button', 'policy-form', 'policy-name',
  'policy-priority', 'policy-route', 'policy-domains', 'policy-networks', 'policy-error',
  'policies-enable', 'policies-disable', 'policies-global-status', 'policy-rows', 'policy-empty', 'policy-create-title', 'policy-submit-button',
].map((id) => [id, document.getElementById(id)]));

let refreshTimer;
let configViewController = null;
let editingPolicyId = null;
let editingPeerId = null;
let publishedUpstreamPorts = [];
let failoverFormDirty = false;
let defaultRouteDirty = false;
let lastData = null;

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json', ...(options.headers || {}) } : options.headers,
  });
  if (response.status === 401 && url !== '/api/session') showLogin();
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { message = (await response.json()).error || message; } catch (_) { /* Response is not JSON. */ }
    throw new Error(message);
  }
  const type = response.headers.get('content-type') || '';
  return type.includes('application/json') ? response.json() : response.text();
}

function showLogin() {
  clearInterval(refreshTimer);
  failoverFormDirty = false;
  defaultRouteDirty = false;
  for (const key of Object.keys(settingsDirty)) settingsDirty[key] = false;
  dnsTestResults = null;
  elements['app-view'].hidden = true;
  elements['logout-button'].hidden = true;
  elements['primary-nav'].hidden = true;
  elements['login-view'].hidden = false;
  for (const dialog of document.querySelectorAll('dialog[open]')) dialog.close();
  elements.password.focus();
}

function showApp() {
  elements['login-view'].hidden = true;
  elements['app-view'].hidden = false;
  elements['logout-button'].hidden = false;
  elements['primary-nav'].hidden = false;
  refresh();
  clearInterval(refreshTimer);
  refreshTimer = setInterval(refresh, 5000);
}

function showMessage(message) {
  text(elements['page-message'], message);
  elements['page-message'].hidden = !message;
}

function bytes(value) {
  const number = Number(value || 0);
  if (number < 1024) return `${number} ${t('B')}`;
  if (number < 1024 ** 2) return `${(number / 1024).toFixed(1)} ${t('KiB')}`;
  if (number < 1024 ** 3) return `${(number / 1024 ** 2).toFixed(1)} ${t('MiB')}`;
  return `${(number / 1024 ** 3).toFixed(1)} ${t('GiB')}`;
}

function time(value, relativeDays = false) {
  if (!value) return t('Never');
  const elapsed = Math.max(0, Date.now() - Date.parse(value));
  if (elapsed < 60_000) return t('{n}s ago', { n: Math.floor(elapsed / 1000) });
  if (elapsed < 3_600_000) return t('{n}m ago', { n: Math.floor(elapsed / 60_000) });
  if (elapsed < 86_400_000) return t('{n}h ago', { n: Math.floor(elapsed / 3_600_000) });
  if (relativeDays) return t('{n}d ago', { n: Math.floor(elapsed / 86_400_000) });
  return new Date(value).toLocaleString(I18N.locale);
}

let pendingConfirmation = null;
let confirmedAction = null;
const confirmationError = document.querySelector('#confirm-action-error');
function confirmAction(title, message, acceptLabel, values = {}, action = null, warning = '') {
  const dialog = elements['confirm-action-dialog'];
  if (dialog.open || pendingConfirmation) return Promise.resolve(false);
  text(elements['confirm-action-title'], title);
  const messageNode = elements['confirm-action-message'];
  messageNode.textContent = [...[message].flat(), warning].filter(Boolean).map(key => t(key, values)).join('\n\n');
  confirmedAction = action;
  confirmationError.hidden = true;
  confirmationError.textContent = '';
  text(elements['confirm-action-accept'], acceptLabel);
  dialog.returnValue = 'cancel';
  elements['confirm-action-accept'].disabled = false;
  return new Promise((resolve) => {
    pendingConfirmation = resolve;
    dialog.showModal();
    elements['confirm-action-cancel'].focus();
  });
}
elements['confirm-action-cancel'].addEventListener('click', () => elements['confirm-action-dialog'].close('cancel'));
elements['confirm-action-accept'].addEventListener('click', async () => {
  const accept = elements['confirm-action-accept'];
  const cancel = elements['confirm-action-cancel'];
  const dialog = elements['confirm-action-dialog'];
  accept.disabled = true;
  cancel.disabled = true;
  confirmationError.hidden = true;
  try {
    if (confirmedAction) await confirmedAction();
    dialog.close('confirm');
  } catch (error) {
    const hints = {
      'Upstream is assigned to a client': 'Reassign the clients pinned to this tunnel before deleting it.',
      'Upstream is used by the default route': 'Choose another default route before deleting this tunnel.',
      'Upstream is used by a routing policy': 'Change the routing rules that use this tunnel before deleting it.',
    };
    const reason = Object.keys(hints).find(key => error.message === key || error.message === t(key));
    text(confirmationError, hints[reason] || error.message);
    confirmationError.hidden = false;
  } finally {
    accept.disabled = false;
    cancel.disabled = false;
  }
});
elements['confirm-action-dialog'].addEventListener('cancel', (event) => {
  if (elements['confirm-action-cancel'].disabled) event.preventDefault();
});
elements['confirm-action-dialog'].addEventListener('close', () => {
  const resolve = pendingConfirmation;
  pendingConfirmation = null;
  resolve?.(elements['confirm-action-dialog'].returnValue === 'confirm');
});

function button(label, style, action) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = `button ${style} compact`;
  item.textContent = t(label);
  item.addEventListener('click', action);
  return item;
}

function cell(label, content, className = '') {
  const item = document.createElement('td');
  item.dataset.label = t(label);
  item.className = className;
  if (content instanceof Node) item.append(content); else item.textContent = content;
  return item;
}

function statusBadge(client) {
  const age = client.runtimeLatestHandshakeAt ? Date.now() - Date.parse(client.runtimeLatestHandshakeAt) : Infinity;
  const online = client.enabled && age >= -60000 && age < 300000;
  return stateBadge(!client.enabled ? 'Disabled' : online ? 'Online' : 'Enabled', !client.enabled ? 'disabled' : online ? 'running' : 'enabled');
}

function stateBadge(label, style) {
  const badge = document.createElement('span');
  badge.className = `status-badge ${style}`;
  const dot = document.createElement('span');
  dot.className = 'status-dot';
  badge.append(dot, t(label));
  return badge;
}

function routeValue(route) {
  return route.type === 'upstream' ? `upstream:${route.upstreamId}` : route.type;
}

function routeFromValue(value) {
  return value.startsWith('upstream:') ? { type: 'upstream', upstreamId: value.slice(9) } : { type: value };
}

function directRouteLabel() {
  return t('Direct via eth0 ({name})', { name: lastData?.guiSettings?.panelName || 'Server A' });
}

function routeLabel(route, upstreams) {
  if (route.type === 'direct') return directRouteLabel();
  if (route.type === 'blocked') return t('Blocked');
  return upstreams.find((item) => item.id === route.upstreamId)?.name || t('Missing upstream');
}

function updateRouteSelect(select, upstreams, selected, clientMode = false) {
  const previous = selected || select.value;
  select.replaceChildren();
  for (const [value, label] of (clientMode ? [['default', 'Automatic'], ['direct', 'Direct via eth0 (Server A)']] : [['direct', 'Direct via eth0 (Server A)'], ['blocked', 'Blocked']])) {
    const option = document.createElement('option'); option.value = value; option.textContent = label === 'Direct via eth0 (Server A)' ? directRouteLabel() : t(label); select.append(option);
  }
  for (const upstream of upstreams) {
    const option = document.createElement('option');
    option.value = `upstream:${upstream.id}`;
    option.textContent = t('Upstream: {name}{status}', { name: upstream.name, status: '' });
    select.append(option);
  }
  if ([...select.options].some((option) => option.value === previous)) select.value = previous;
}

function clientModeValue(client) {
  return client.egress === 'upstream' ? `upstream:${client.upstreamId}` : (client.egress || 'default');
}
function clientModeBody(value) {
  return value.startsWith('upstream:') ? { egress: 'upstream', upstreamId: value.slice(9) } : { egress: value, upstreamId: null };
}
function clientModeLabel(value, upstreams = lastData?.routing.upstreams || []) {
  if (value === 'default') return t('Automatic');
  if (value === 'direct') return directRouteLabel();
  return t('Upstream: {name}{status}', { name: upstreams.find((u) => `upstream:${u.id}` === value)?.name || t('Missing upstream'), status: '' });
}
function updateClientModeHint(select, hint) {
  const value = select.value;
  if (value === 'default') text(hint, 'Routing rules and B/C failover apply. DNS goes directly via Server A.');
  else if (value === 'direct') text(hint, 'All traffic and DNS go directly via Server A. Destination routing rules are ignored.');
  else text(hint, 'All traffic and DNS use only {name}. Destination rules and failover are ignored; access is blocked if this tunnel fails.', { name: lastData?.routing.upstreams.find((u) => `upstream:${u.id}` === value)?.name || t('Missing upstream') });
}

function upstreamConnectionBadge(upstream) {
  const states = {
    connected: ['Connected', 'running', 'A recent authenticated handshake succeeded. Traffic forwarding is not actively probed.'],
    awaiting: ['Awaiting', 'disabled', 'No handshake yet. An idle tunnel may wait for traffic.'],
    idle: ['Idle', 'disabled', 'The previous handshake is old; keepalive is off, so inactivity does not establish a failure.'],
    stale: ['Stale', 'warning', 'No recent handshake despite enabled keepalives. Check reachability and the peer configuration.'],
    unknown: ['Unknown', 'warning', 'The running interface did not provide readable peer status.'],
    disabled: ['Disabled', 'disabled', 'This upstream is disabled.'],
    unavailable: ['Unavailable', 'failed', 'The upstream interface is not running.'],
  };
  const [label, style, description] = states[upstream.connectionStatus] || states.unknown;
  const badge = stateBadge(label, style);
  if (label === 'Stale' && I18N.language === 'ru') {
    const wording = document.createElement('span');
    wording.append('Нет свежего', document.createElement('br'), 'handshake');
    badge.replaceChildren(badge.firstChild, wording);
  }
  badge.title = t(description);
  return badge;
}

function publishedPortsHint() {
  return publishedUpstreamPorts.length ? t('Configured published UDP ports: {ports}. Apply Compose changes before using a new range.', { ports: publishedUpstreamPorts.join(', ') }) : t('Published port range is unavailable.');
}

const upstreamEditDialog = document.querySelector('#upstream-edit-dialog');
const upstreamEditForm = document.querySelector('#upstream-edit-form');
const upstreamEditError = upstreamEditForm.querySelector('[role="alert"]');
let upstreamEditId = null;

function syncUpstreamEditMode() {
  const mode = upstreamEditForm.elements.mode.value;
  const endpoint = mode === 'endpoint';
  document.querySelector('#upstream-edit-endpoint').hidden = !endpoint;
  document.querySelector('#upstream-edit-config').hidden = mode !== 'config';
  document.querySelector('#upstream-edit-port').hidden = mode !== 'port';
  upstreamEditForm.elements.listenPort.disabled = mode !== 'port';
  document.querySelector('#upstream-edit-name').hidden = mode !== 'name';
  document.querySelector('#upstream-edit-priority').hidden = mode !== 'priority';
  document.querySelector('#upstream-edit-restart').hidden = mode === 'name' || mode === 'priority';
  upstreamEditForm.elements.priority.disabled = mode !== 'priority';
  upstreamEditForm.elements.tunnelName.required = mode === 'name';
  upstreamEditForm.elements.endpoint.required = endpoint;
  upstreamEditForm.elements.config.required = mode === 'config';
}

function openUpstreamEdit(upstream, mode = 'endpoint') {
  upstreamEditId = upstream.id;
  upstreamEditForm.reset();
  upstreamEditForm.elements.mode.querySelector('[value=priority]').hidden = !lastData?.routing.failover.config.enabled;
  upstreamEditForm.elements.mode.value = mode;
  upstreamEditForm.elements.tunnelName.value = upstream.name;
  upstreamEditForm.elements.priority.value = upstream.failoverPriority ?? '';
  document.querySelector('#upstream-edit-filename').textContent = '';
  upstreamEditForm.elements.listenPort.value = upstream.configuredListenPort || '';
  document.querySelector('#upstream-edit-port-range').textContent = publishedPortsHint();
  upstreamEditForm.elements.endpoint.value = upstream.endpoint || '';
  text(upstreamEditError, '');
  syncUpstreamEditMode();
  upstreamEditDialog.showModal();
}

upstreamEditForm.elements.mode.addEventListener('change', syncUpstreamEditMode);
document.querySelector('#upstream-edit-cancel').addEventListener('click', () => upstreamEditDialog.close());
upstreamEditDialog.addEventListener('close', () => {
  upstreamEditId = null;
  upstreamEditForm.reset();
});
document.querySelector('#upstream-edit-pick').addEventListener('click', () => upstreamEditForm.elements.file.click());
upstreamEditForm.elements.file.addEventListener('change', async () => {
  const picker = upstreamEditForm.elements.file;
  const file = picker.files[0];
  if (!file) return;
  if (file.size > 131072) {
    text(upstreamEditError, 'Configuration file is too large');
    return;
  }
  try {
    const config = await file.text();
    if (upstreamEditDialog.open && picker.files[0] === file) {
      upstreamEditForm.elements.config.value = config;
      document.querySelector('#upstream-edit-filename').textContent = file.name;
      text(upstreamEditError, '');
    }
  } catch (error) {
    if (upstreamEditDialog.open && picker.files[0] === file) text(upstreamEditError, error.message);
  }
});
upstreamEditForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = upstreamEditForm.querySelector('[type="submit"]');
  if (submit.disabled || !upstreamEditId) return;
  const id = upstreamEditId;
  const mode = upstreamEditForm.elements.mode.value;
  const fields = upstreamEditForm.elements;
  const priority = fields.priority.value;
  const [suffix, payload] = {
    endpoint: ['/configuration', { mode, endpoint: fields.endpoint.value }],
    config: ['/configuration', { mode, config: fields.config.value }],
    port: ['', { listenPort: Number(fields.listenPort.value || 0) }],
    name: ['/name', { name: fields.tunnelName.value }],
    priority: ['/failover-priority', { failoverPriority: priority === '' ? null : Number(priority) }],
  }[mode];
  if (mode === 'priority' && priority === '' && losesFailoverCandidate(id) && !await confirmAction('Failover priority', fallbackWarning, 'Save')) return;
  text(upstreamEditError, '');
  submit.disabled = true;
  try {
    await request(`/api/routing/upstreams/${id}${suffix}`, { method: 'PUT', body: JSON.stringify(payload) });
    if (upstreamEditId === id) upstreamEditDialog.close();
    await refresh();
  } catch (error) {
    if (upstreamEditId === id) text(upstreamEditError, error.message);
  } finally {
    submit.disabled = false;
  }
});


// Keep only the last displayed probe timestamps when checks are switched off.
const upstreamCheckTimes = new Map();

function losesFailoverCandidate(id) {
  const routing = lastData?.routing;
  return routing?.failover.config.enabled && routing.upstreams.some(u => u.id === id && u.enabled && u.failoverPriority != null)
    && routing.upstreams.filter(u => u.id !== id && u.enabled && u.failoverPriority != null).length < 2;
}
const fallbackWarning = 'Fewer than two eligible tunnels will remain. The route will become fixed on the remaining tunnel, or blocked if none remains.';
function renderUpstreams(routing) {
  const { upstreams, failover } = routing;
  for (const id of upstreamCheckTimes.keys()) {
    if (!upstreams.some((item) => item.id === id)) upstreamCheckTimes.delete(id);
  }
  const enabled = failover.config.enabled;
  const effective = routing.effectiveDefaultRoute;
  const current = effective?.type === 'upstream' ? upstreams.find((item) => item.id === effective.upstreamId) : null;
  const priorities = upstreams.filter((item) => item.enabled && item.failoverPriority != null).map((item) => item.failoverPriority);
  const preferred = Math.min(...priorities);
  const routeName = current?.name ?? (effective?.type === 'direct' ? routeLabel(effective, upstreams) : null);
  const routeStatus = elements['failover-status'];
  routeStatus.replaceChildren();
  if (!enabled && routeName !== null) {
    const route = document.createElement('strong');
    route.className = 'upstream-route-value';
    route.textContent = routeName;
    routeStatus.append(t('Current route: {name}', { name: '' }), route);
  } else if (!enabled || effective?.type === 'blocked') {
    routeStatus.append(t(effective?.type === 'blocked' ? 'Route blocked' : 'No route selected'));
  }
  const separator = document.createElement('span');
  separator.className = 'upstream-route-separator';
  separator.setAttribute('aria-hidden', 'true');
  const failoverState = document.createElement('strong');
  failoverState.className = enabled ? 'upstream-failover-on' : 'upstream-failover-off';
  failoverState.textContent = t(enabled ? 'enabled' : 'disabled');
  if (routeStatus.childNodes.length) routeStatus.append(separator);
  routeStatus.append(t('Failover:'), ' ', failoverState);
  const open = new Set([...elements['upstream-rows'].querySelectorAll('details[open]')].map((item) => item.closest('tr').dataset.upstreamId));
  const active = document.activeElement;
  const focusRow = active?.closest('#upstream-rows tr');
  const focusIndex = focusRow ? [...focusRow.querySelectorAll('button, a, summary')].indexOf(active) : -1;
  elements['upstream-rows'].replaceChildren();
  elements['upstream-empty'].hidden = upstreams.length !== 0;
  for (const upstream of upstreams) {
    const actions = document.createElement('div');
    actions.className = 'row-actions upstream-actions';
    actions.append(button('Edit', 'secondary', () => openUpstreamEdit(upstream)));
    const download = document.createElement('a');
    download.className = 'button secondary compact'; download.textContent = t('Download');
    download.href = `/api/routing/upstreams/${upstream.id}/configuration`;
    actions.append(download);
    actions.append(button('Reset', 'danger', async () => {
      if (!await confirmAction('Reset upstream traffic', 'Reset traffic for upstream “{name}”? Only its accumulated traffic will be cleared. Configuration, connections and handshake times are preserved. This cannot be undone in the panel. Continue?', 'Reset', { name: upstream.name })) return;
      try { await request(`/api/routing/upstreams/${upstream.id}/statistics/reset`, { method: 'POST', body: JSON.stringify({ confirm: true }) }); await refresh(); }
      catch (error) { showMessage(error.message); }
    }));
    actions.append(button(upstream.enabled ? 'Disable' : 'Enable', 'outline-blue', async () => {
      if (upstream.enabled && losesFailoverCandidate(upstream.id) &&
          !await confirmAction('Disable', fallbackWarning, 'Disable')) return;
      try {
        await request(`/api/routing/upstreams/${upstream.id}/${upstream.enabled ? 'disable' : 'enable'}`, { method: 'POST' });
        await refresh();
      } catch (error) { showMessage(error.message); }
    }));
    actions.append(button('Delete', 'danger', async () => {
      const removed = await confirmAction('Delete upstream', ['Delete tunnel “{name}”?', 'Its imported private configuration will be deleted.'], 'Delete upstream',
        { name: upstream.name, priority: upstream.failoverPriority },
        () => request(`/api/routing/upstreams/${upstream.id}`, { method: 'DELETE' }),
        losesFailoverCandidate(upstream.id) ? fallbackWarning : upstream.failoverPriority == null ? '' : 'This tunnel participates in failover (priority {priority}). Deleting it removes it from automatic switching.');
      if (removed) await refresh();
    }));
    const upstreamButtons = [...actions.children]; actions.replaceChildren();
    for (const group of [upstreamButtons.slice(0, 2), upstreamButtons.slice(2)]) {
      const line = document.createElement('div'); line.className = 'upstream-action-line'; line.append(...group); actions.append(line);
    }
    const statusStyle = upstream.status === 'up' ? 'running' : upstream.status === 'disabled' ? 'disabled' : 'failed';
    const transfer = document.createElement('span');
    transfer.className = 'secondary-value numeric traffic-values';
    transfer.textContent = `↓ ${bytes(upstream.transferRx)}\n↑ ${bytes(upstream.transferTx)}`;
    const interfaceInfo = document.createElement('div');
    interfaceInfo.className = 'resource-details';
    const interfaceName = document.createElement('span');
    interfaceName.className = 'mono';
    interfaceName.textContent = t('{protocol} · {interface} / table {table}', { protocol: upstream.protocol || 'AWG', interface: upstream.interface, table: upstream.table });
    interfaceInfo.append(interfaceName, stateBadge(upstream.status === 'up' ? 'Running' : upstream.status, statusStyle));
    const endpointInfo = document.createElement('div');
    endpointInfo.className = 'resource-details';
    const endpointValue = document.createElement('button');
    endpointValue.type = 'button';
    endpointValue.addEventListener('click', () => openUpstreamEdit(upstream, 'endpoint'));
    endpointValue.className = 'mono upstream-edit-link';
    endpointValue.textContent = upstream.endpoint || '—';
    const portValue = document.createElement('span');
    portValue.className = 'secondary-value';
    portValue.textContent = t('Local UDP {port}{mode}', { port: upstream.listenPort || '—', mode: t(upstream.configuredListenPort ? ' · fixed' : ' · automatic') });
    if (upstream.configuredListenPort && !upstream.portInPublishedRange) portValue.textContent += t(' · outside published range');
    const name = document.createElement('strong');
    const nameLink = document.createElement('button');
    nameLink.type = 'button';
    nameLink.className = 'upstream-edit-link';
    nameLink.textContent = upstream.name;
    nameLink.addEventListener('click', () => openUpstreamEdit(upstream, 'name'));
    name.append(nameLink);
    const heading = document.createElement('div');
    heading.className = 'upstream-name';
    heading.append(name);
    if (!enabled && routing.defaultRoute.type === 'upstream' && routing.defaultRoute.upstreamId === upstream.id) {
      heading.append(stateBadge('Default', 'running'));
    }
    if (enabled && upstream.enabled && upstream.failoverPriority != null) {
      heading.append(stateBadge(upstream.failoverPriority === preferred ? 'Primary route' : 'Backup', upstream.failoverPriority === preferred ? 'enabled' : 'enabled upstream-backup'));
    }
    const details = document.createElement('details');
    details.open = open.has(upstream.id);
    const summary = document.createElement('summary');
    text(summary, 'Details');
    interfaceInfo.append(portValue);
    details.append(summary, interfaceInfo);
    endpointInfo.append(heading, endpointValue, details);
    const priority = button(upstream.failoverPriority == null ? 'Excluded' : String(upstream.failoverPriority), 'secondary', () => openUpstreamEdit(upstream, 'priority'));
    priority.disabled = !enabled;
    priority.setAttribute('aria-label', t('Edit failover priority for {name}', { name: upstream.name }));
    const row = document.createElement('tr');
    row.classList.toggle('row-disabled', !upstream.enabled);
    row.append(
      cell('Server', endpointInfo, 'upstream-server'),
      cell('Priority', priority, 'numeric upstream-priority-column'),
      cell('Availability', upstreamAvailability(upstream, failover), 'connection-column upstream-availability'),
      cell('Connection', upstreamConnectionBadge(upstream), 'connection-column'),
      cell('Handshake', time(upstream.latestHandshakeAt), 'numeric'),
      cell('Transfer', transfer),
      cell('Actions', actions, 'actions-column'),
    );
    if (upstream.error) row.title = t(upstream.error);
    row.dataset.upstreamId = upstream.id;
    elements['upstream-rows'].append(row);
    if (focusRow?.dataset.upstreamId === upstream.id && focusIndex >= 0) {
      row.querySelectorAll('button, a, summary')[focusIndex]?.focus({ preventScroll: true });
    }
  }
}

function renderPolicies(policies, upstreams) {
  const locked = lastData?.routing.policiesEnabled === false;
  elements['policy-rows'].replaceChildren();
  elements['policy-empty'].hidden = policies.length !== 0;
  for (const policy of policies) {
    const matches = document.createElement('span');
    matches.className = 'secondary-value';
    matches.textContent = t('Domains: {domains}, networks: {networks}', { domains: policy.domains.length, networks: policy.networks.length });
    matches.title = [...policy.domains, ...policy.networks].join('\n');
    const actions = document.createElement('div');
    actions.className = 'row-actions';
    actions.append(button('Edit', 'secondary', () => openPolicyEditor(policy, upstreams)));
    actions.append(button(policy.enabled ? 'Disable' : 'Enable', 'outline-blue', async () => {
      try { await request(`/api/routing/policies/${policy.id}/${policy.enabled ? 'disable' : 'enable'}`, { method: 'POST' }); await refresh(); }
      catch (error) { showMessage(error.message); }
    }));
    actions.append(button('Delete', 'danger', async () => {
      if (!await confirmAction('Delete routing policy', 'Delete routing policy “{name}”?', 'Delete routing policy', { name: policy.name })) return;
      try { await request(`/api/routing/policies/${policy.id}`, { method: 'DELETE' }); await refresh(); }
      catch (error) { showMessage(error.message); }
    }));
    const row = document.createElement('tr');
    row.append(
      cell('Priority', String(policy.priority), 'numeric'),
      cell('Name', policy.name, 'client-name'),
      cell('Matches', matches),
      cell('Destination', routeLabel(policy.route, upstreams)),
      cell('Status', stateBadge(policy.enabled ? 'Enabled' : 'Disabled', policy.enabled ? 'running' : 'disabled'), 'status-column'),
      cell('Actions', actions, 'actions-column'),
    );
    row.classList.toggle('row-disabled', locked || !policy.enabled);
    elements['policy-rows'].append(row);
  }
}

function renderRouting(routing) {
  for (const [id, active] of [['policies-enable', routing.policiesEnabled !== false], ['policies-disable', routing.policiesEnabled === false]]) {
    elements[id].classList.toggle('primary', active);
    elements[id].classList.toggle('secondary', !active);
    elements[id].setAttribute('aria-pressed', String(active));
  }

  text(elements['policies-global-status'], routing.policiesEnabled !== false ? 'Routing policies are enabled' : 'Routing policies are disabled');
  for (const [select, hint] of [['client-route', 'client-route-hint'], ['rename-route', 'rename-route-hint']]) {
    updateRouteSelect(elements[select], routing.upstreams, undefined, true);
    updateClientModeHint(elements[select], elements[hint]);
  }
  publishedUpstreamPorts = routing.publishedUpstreamPorts || [];
  elements['upstream-port-hint'].textContent = t('{hint} Leave blank to preserve the imported setting.', { hint: publishedPortsHint() });
  elements['dns-upstream'].textContent = (routing.dns.upstreams || [routing.dns.upstream]).join(' → ');
  elements['upstream-count'].textContent = routing.upstreams.length;
  elements['policy-count'].textContent = routing.policies.length;
  updateRouteSelect(elements['default-route'], routing.upstreams, defaultRouteDirty ? undefined : routeValue(routing.defaultRoute));
  updateRouteSelect(elements['policy-route'], routing.upstreams);
  renderUpstreams(routing);
  renderPolicies(routing.policies, routing.upstreams);
  renderFailover(routing);
  renderRouteMode(routing);
}

function upstreamAvailability(upstream, {config, health}) {
  const sample = health[upstream.id];
  if (config.enabled && sample) {
    upstreamCheckTimes.set(upstream.id, { checkedAt: sample.checkedAt, lastSuccessAt: sample.lastSuccessAt });
  }
  const times = config.enabled ? sample : upstreamCheckTimes.get(upstream.id);
  const status = sample?.status || 'checking';
  const retrying = status === 'healthy' && sample.failures > 0;
  const checkable = config.enabled && upstream.enabled && upstream.failoverPriority != null;
  const label = !config.enabled ? t('Checks disabled') : !upstream.enabled ? t('Disabled')
    : upstream.failoverPriority == null ? t('Excluded from failover')
      : retrying ? t('Retrying ({n}/{total})', { n: sample.failures, total: config.failureThreshold })
        : status === 'checking' ? t('Checking ({n}/{total})', { n: sample?.successes || 0, total: config.recoveryThreshold })
          : t(status[0].toUpperCase() + status.slice(1));
  const tone = !checkable ? 'disabled' : status === 'healthy' && !retrying ? 'running'
    : ['unavailable', 'unhealthy'].includes(status) ? 'failed' : 'warning';
  const box = document.createElement('div');
  box.className = 'resource-details';
  box.append(stateBadge(label, tone));
  for (const [key, value, fallback] of [['Check', times?.checkedAt, '—'],
      ['Successful', times?.lastSuccessAt, '—']]) {
    const line = document.createElement('span');
    line.className = 'secondary-value';
    line.textContent = t(key) + ': ' + (value ? new Date(value).toLocaleTimeString(I18N.locale) : t(fallback));
    box.append(line);
  }
  return box;
}

function renderFailover(routing) {
  if (!routing.failover) return;
  const { config, selectedUpstreamId, preferredUpstreamIds, error } = routing.failover;
  const candidates = routing.upstreams.filter((upstream) => upstream.failoverPriority != null)
    .map((upstream) => ({ upstreamId: upstream.id, priority: upstream.failoverPriority }));
  text(elements['failover-runtime-error'], error || '');
  elements['failover-runtime-error'].hidden = !error;
  const selectedPriority = candidates.find((item) => item.upstreamId === selectedUpstreamId)?.priority;
  elements['failover-return'].hidden = !config.enabled || !candidates.some((item) => item.priority < selectedPriority);
  elements['failover-return'].disabled = !preferredUpstreamIds?.length;

  if (failoverFormDirty) return;
  elements['failover-auto-return'].checked = config.autoFailback;
  for (const [id, key] of [['interval', 'intervalSeconds'], ['timeout', 'timeoutSeconds'], ['failures', 'failureThreshold'], ['recovery', 'recoveryThreshold']]) {
    elements[`failover-${id}`].value = config[key];
  }
  elements['failover-targets'].value = config.targets.join('\n');
}

function updatePeerConnectionFields() {
  const enabled = elements['peer-connection-enabled'].checked;
  elements['peer-connection-fields'].hidden = !enabled;
  for (const id of ['peer-connection-endpoint', 'peer-connection-keepalive']) {
    elements[id].disabled = !enabled;
    elements[id].required = enabled;
  }
}

function openPeerConnection(client) {
  editingPeerId = client.id;
  text(elements['peer-connection-title'], 'Connection: {name}', { name: client.name });
  elements['peer-connection-enabled'].checked = Boolean(client.reverseInitiation);
  elements['peer-connection-endpoint'].value = client.reverseInitiation?.endpoint || '';
  elements['peer-connection-keepalive'].value = client.reverseInitiation?.persistentKeepalive || 25;
  text(elements['peer-connection-error'], '');
  updatePeerConnectionFields();
  elements['peer-connection-dialog'].showModal();
}

let renamingClientId = null;
function openRenameClient(client) {
  renamingClientId = client.id;
  elements['rename-name'].value = client.name;
  updateRouteSelect(elements['rename-route'], lastData?.routing.upstreams || [], clientModeValue(client), true);
  updateClientModeHint(elements['rename-route'], elements['rename-route-hint']);
  text(elements['rename-error'], '');
  elements['rename-dialog'].showModal();
  elements['rename-name'].focus();
  elements['rename-name'].select();
}

const exportMode = document.querySelector('#export-mode');
const exportQr = document.querySelector('#export-qr');
const qrContent = document.querySelector('#qr-content');
let exportClient = null;

function selectClientExport(mode) {
  const client = exportClient;
  if (!client) return;
  const qr = mode === 'qr';
  exportQr.hidden = !qr;
  if (!qr) {
    stopQrAnimation();
    elements['qr-image'].removeAttribute('src');
    openClientConfig(client, mode === 'vpn');
    return;
  }
  configViewController?.abort();
  configViewController = null;
  elements['config-loading'].hidden = true;
  elements['config-text'].value = '';
  elements['config-text'].hidden = true;
  elements['config-vpn-text'].textContent = '';
  elements['config-vpn-text'].hidden = true;
  elements['config-copy'].hidden = true;
  elements['config-download'].hidden = true;
  elements['config-download'].removeAttribute('href');
  text(elements['config-error'], '');
  qrClient = client;
  selectQrMode(lastData?.guiSettings?.qrFormat === 'amnezia');
}

exportMode.addEventListener('change', () => selectClientExport(exportMode.value));

function openClientExport(client) {
  exportClient = client;
  exportMode.hidden = false;
  exportMode.value = 'qr';
  elements['config-dialog'].classList.add('export-dialog');
  exportQr.append(qrContent);
  text(elements['config-title'], 'Export: {name}', { name: client.name });
  elements['config-dialog'].showModal();
  selectClientExport('qr');
}

async function openClientConfig(client, vpn = false) {
  configViewController?.abort();
  const controller = new AbortController();
  configViewController = controller;
  if (!exportClient) text(elements['config-title'], vpn ? 'vpn://: {name}' : 'Config: {name}', { name: client.name });
  elements['config-vpn-text'].textContent = '';
  elements['config-vpn-text'].hidden = true;
  elements['config-copy'].hidden = true;
  text(elements['config-copy'], 'Copy');
  elements['config-download'].hidden = true;
  elements['config-download'].removeAttribute('href');
  elements['config-text'].value = '';
  elements['config-text'].hidden = true;
  text(elements['config-error'], '');
  elements['config-loading'].hidden = false;
  if (!elements['config-dialog'].open) elements['config-dialog'].showModal();
  try {
      const config = await request(`/api/wireguard/client/${client.id}/${vpn ? 'configuration.vpn' : 'configuration'}`, {
      signal: controller.signal, cache: 'no-store',
    });
    if (!controller.signal.aborted && elements['config-dialog'].open) {
      elements['config-text'].value = config;
      elements['config-text'].hidden = vpn;
      elements['config-vpn-text'].textContent = vpn ? config : '';
      elements['config-vpn-text'].hidden = !vpn;
      elements['config-copy'].hidden = !vpn;
      elements['config-download'].href = `/api/wireguard/client/${client.id}/${vpn ? 'configuration.vpn' : 'configuration'}`;
      elements['config-download'].hidden = false;
    }
  } catch (error) {
    if (!controller.signal.aborted && elements['config-dialog'].open) text(elements['config-error'], error.message);
  } finally {
    if (configViewController === controller) {
      elements['config-loading'].hidden = true;
      configViewController = null;
    }
  }
}

function renderClients(clients) {
  elements['client-rows'].replaceChildren();
  elements['empty-state'].hidden = clients.length !== 0;
  for (const client of clients) {
    const row = document.createElement('tr');
    row.classList.toggle('row-disabled', !client.enabled);
    const name = document.createElement('span');
    name.className = 'client-name';
    name.textContent = client.name;
    const marker = document.createElement('small');
    marker.className = 'secondary-value'; marker.textContent = clientModeLabel(clientModeValue(client));
    name.append(document.createElement('br'), marker);
    if (client.reverseInitiation) name.title = t('Initiates to {endpoint}; keepalive {seconds}s', { endpoint: client.reverseInitiation.endpoint, seconds: client.reverseInitiation.persistentKeepalive });
    const transfer = document.createElement('span');
    transfer.className = 'secondary-value numeric traffic-values';
    transfer.textContent = `↓ ${bytes(client.transferRx)}\n↑ ${bytes(client.transferTx)}`;
    const actions = document.createElement('div');
    actions.className = 'row-actions';

    actions.append(button('Edit', 'secondary', () => openRenameClient(client)));
    actions.append(button('Connection', 'secondary', () => openPeerConnection(client)));
    actions.append(button('Export', 'secondary', () => openClientExport(client)));
    actions.append(button('Reset', 'danger', async () => {
      if (!await confirmAction('Reset statistics', 'Reset statistics for client “{name}”? Traffic totals and the saved last handshake will be cleared for this client only. Keys, configuration and VPN connections are preserved. This cannot be undone in the panel. Continue?', 'Reset', { name: client.name })) return;
      try { await request(`/api/wireguard/client/${client.id}/statistics/reset`, { method: 'POST', body: JSON.stringify({ confirm: true }) }); await refresh(); }
      catch (error) { showMessage(error.message); }
    }));
    actions.append(button(client.enabled ? 'Disable' : 'Enable', 'outline-blue', async () => {
      try {
        await request(`/api/wireguard/client/${client.id}/${client.enabled ? 'disable' : 'enable'}`, { method: 'POST' });
        await refresh();
      } catch (error) { showMessage(error.message); }
    }));
    actions.append(button('Delete', 'danger', async () => {
      if (!await confirmAction('Delete client', 'Delete client “{name}”? This permanently removes its private key.', 'Delete client', { name: client.name })) return;
      try {
        await request(`/api/wireguard/client/${client.id}`, { method: 'DELETE' });
        await refresh();
      } catch (error) { showMessage(error.message); }
    }));

    actions.classList.add('client-actions');
    const actionButtons = [...actions.children];
    actions.replaceChildren();
    for (const group of [actionButtons.slice(0, 3), actionButtons.slice(3)]) {
      const line = document.createElement('div');
      line.className = 'client-action-line';
      line.append(...group);
      actions.append(line);
    }
    row.append(
      cell('Name', name),
      cell('Protocol', client.protocol || 'AWG3', 'mono'),
      cell('Address', client.address, 'mono'),
      cell('Status', statusBadge(client), 'status-column'),
      cell('Latest handshake', time(client.latestHandshakeAt, true), 'numeric'),
      cell('Transfer', transfer),
      cell('Actions', actions, 'actions-column'),
    );
    elements['client-rows'].append(row);
  }
}

const upstreamRefreshError = document.querySelector('#upstream-refresh-error');

async function refresh() {
  try {
    const [status, clients, routing, guiSettings] = await Promise.all([
      request('/api/wireguard/status'),
      request('/api/wireguard/client'),
      request('/api/routing'),
      request('/api/settings'),
    ]);
    lastData = { status, clients, routing, guiSettings };
    renderData(lastData);
    upstreamRefreshError.hidden = true;
    showMessage('');
  } catch (error) {
    text(upstreamRefreshError, error.message);
    upstreamRefreshError.hidden = false;
    if (!lastData) text(elements['failover-status'], 'Unknown');
    if (!elements['app-view'].hidden) showMessage(error.message);
  }
}

function renderData({ status, clients, routing, guiSettings }) {
    elements['endpoint-value'].textContent = status.endpoints
      ? Object.entries(status.endpoints).map(([protocol, value]) => `${protocol === 'WG' ? 'WireGuard' : protocol} ${value}`).join('\n')
      : status.endpoint.split(' · ').join('\n');
    elements['endpoint-value'].title = status.endpoint;
    elements['amneziawg-version'].textContent = status.amneziawg?.version || t('Unknown');
    elements['amneziawg-version'].title = status.amneziawg?.image || '';
    elements['client-count'].textContent = status.clients;
    elements['connected-count'].textContent = status.connected;
    elements['last-updated'].textContent = t('Updated {time}', { time: new Date().toLocaleTimeString(I18N.locale) });
    renderClients(clients);
    renderRouting(routing);
    renderGuiSettings(guiSettings);
}

window.addEventListener('awg-language-change', () => { if (lastData && !elements['app-view'].hidden) renderData(lastData); });

function openCreate() {
  text(elements['create-error'], '');
  elements['create-panel'].showModal();
  updateRouteSelect(elements['client-route'], lastData?.routing.upstreams || [], 'default', true);
  updateClientModeHint(elements['client-route'], elements['client-route-hint']);
  elements['client-name'].focus();
}

function showPage(page) {
  elements['clients-page'].hidden = page !== 'clients';
  elements['routing-page'].hidden = page !== 'routing';
  elements['settings-page'].hidden = page !== 'settings';
  elements['about-page'].hidden = page !== 'about';
  if (page === 'about') request('/api/about').then(info => {
    for (const [id, key] of [['about-version','version'],['about-commit','baseCommit'],['about-awg','amneziawgVersion']]) elements[id].textContent = info[key] || '—';
    const commit = elements['about-build-commit'];
    commit.textContent = '—';
    if (/^[0-9a-f]{40}$/.test(info.commit)) {
      const link = document.createElement('a');
      link.href = `https://github.com/AlekseyShepelev/awg-chain-easy-mod/commit/${info.commit}`;
      link.textContent = info.commit.slice(0, 7);
      link.title = info.commit;
      commit.replaceChildren(link);
    }
  }).catch(error => showMessage(error.message));
  for (const item of document.querySelectorAll('.nav-button')) item.classList.toggle('active', item.dataset.page === page);
}

function listValues(value) {
  return [...new Set(value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean))];
}

function resetPolicyEditor() {
  editingPolicyId = null;
  for (const control of elements['policy-form'].querySelectorAll('input, select, textarea, button')) control.disabled = false;
  elements['policy-form'].reset();
  elements['policy-priority'].value = '100';
  text(elements['policy-create-title'], 'New destination policy');
  text(elements['policy-submit-button'], 'Create policy');
  text(elements['policy-error'], '');
}

function openPolicyEditor(policy = null, upstreams = []) {
  resetPolicyEditor();
  if (policy) {
    editingPolicyId = policy.id;
    text(elements['policy-create-title'], 'Edit destination policy');
    text(elements['policy-submit-button'], 'Save policy');
    elements['policy-name'].value = policy.name;
    elements['policy-priority'].value = String(policy.priority);
    elements['policy-domains'].value = policy.domains.join('\n');
    elements['policy-networks'].value = policy.networks.join('\n');
    updateRouteSelect(elements['policy-route'], upstreams, routeValue(policy.route));
  }
  elements['policy-create-panel'].showModal();
  elements['policy-name'].focus();
}

elements['login-form'].addEventListener('submit', async (event) => {
  event.preventDefault();
  text(elements['login-error'], '');
  try {
    await request('/api/session', { method: 'POST', body: JSON.stringify({ password: elements.password.value }) });
    elements.password.value = '';
    showApp();
  } catch (error) { text(elements['login-error'], error.message); }
});

elements['logout-button'].addEventListener('click', async () => {
  try { await request('/api/session', { method: 'DELETE' }); } finally { showLogin(); }
});
for (const item of document.querySelectorAll('.nav-button')) item.addEventListener('click', () => showPage(item.dataset.page));
elements['new-client-button'].addEventListener('click', openCreate);
elements['empty-create-button'].addEventListener('click', openCreate);
elements['cancel-create-button'].addEventListener('click', () => elements['create-panel'].close());
elements['create-panel'].addEventListener('close', () => text(elements['create-error'], ''));
elements['refresh-button'].addEventListener('click', refresh);
for (const [id, enabled] of [['policies-enable', true], ['policies-disable', false]]) {
  elements[id].addEventListener('click', async () => {
    if ((lastData.routing.policiesEnabled !== false) === enabled) return;
    elements['policies-enable'].disabled = elements['policies-disable'].disabled = true;
    try { await request('/api/routing/policies/enabled', { method: 'PUT', body: JSON.stringify({ enabled }) }); await refresh(); }
    catch (error) { showMessage(error.message); }
    finally { elements['policies-enable'].disabled = elements['policies-disable'].disabled = false; }
  });
}

elements['reset-statistics-button'].addEventListener('click', async () => {
  if (!await confirmAction('Reset statistics', 'Reset traffic totals and last handshake for ALL clients? This clears the displayed statistics; undo is not available in the panel. Keys, profiles and VPN connections will remain unchanged. Active clients will immediately start accumulating new statistics. Continue?', 'Reset statistics')) return;
  elements['reset-statistics-button'].disabled = true;
  try {
    await request('/api/wireguard/statistics/reset', { method: 'POST', body: JSON.stringify({ confirm: true }) });
    await refresh();
  } catch (error) { showMessage(error.message); }
  finally { elements['reset-statistics-button'].disabled = false; }
});

elements['reset-upstream-statistics'].addEventListener('click', async () => {
  if (!await confirmAction('Reset upstream traffic', 'Reset traffic totals for ALL upstream tunnels? This clears accumulated traffic in the panel and cannot be undone here. Tunnel configurations, connections and handshake times are preserved. Active tunnels immediately start accumulating new traffic. Continue?', 'Reset')) return;
  elements['reset-upstream-statistics'].disabled = true;
  try { await request('/api/routing/upstreams/statistics/reset', { method: 'POST', body: JSON.stringify({ confirm: true }) }); await refresh(); }
  catch (error) { showMessage(error.message); }
  finally { elements['reset-upstream-statistics'].disabled = false; }
});

elements['upstreams-refresh'].addEventListener('click', async () => {
  elements['upstreams-refresh'].disabled = true;
  try { await refresh(); }
  finally { elements['upstreams-refresh'].disabled = false; }
});

let qrTimer = null;
let qrRequest = 0;
function stopQrAnimation() {
  clearInterval(qrTimer);
  qrTimer = null;
  qrRequest++;
  elements['qr-vpn-image'].removeAttribute('src');
  elements['qr-vpn-image'].hidden = true;
}
let qrClient = null;
async function selectQrMode(amnezia) {
  stopQrAnimation();
  elements['qr-conf-panel'].hidden = amnezia;
  elements['qr-amnezia-panel'].hidden = !amnezia;
  elements['qr-image'].removeAttribute('src');
  if (!qrClient) return;
  if (!amnezia) {
    elements['qr-image'].src = `/api/wireguard/client/${qrClient.id}/qrcode.svg`;
    return;
  }
  const requestId = qrRequest;
  text(elements['qr-vpn-status'], 'Loading QR codes…');
  try {
    const { frames } = await request(`/api/wireguard/client/${qrClient.id}/qrcode.amnezia`);
    if (requestId !== qrRequest || !(elements['qr-dialog'].open || (elements['config-dialog'].open && !exportQr.hidden))) return;
    let index = 0;
    const display = () => {
      elements['qr-vpn-image'].src = frames[index];
      elements['qr-vpn-image'].hidden = false;
      text(elements['qr-vpn-status'], 'QR {current} of {total}', { current: index + 1, total: frames.length });
      index = (index + 1) % frames.length;
    };
    display();
    if (frames.length > 1) qrTimer = setInterval(display, 1000);
  } catch (error) {
    if (requestId === qrRequest) text(elements['qr-vpn-status'], error.message);
  }
}
function openClientQr(client) {
  qrClient = client;
  text(elements['qr-title'], 'QR code: {name}', { name: client.name });
  elements['qr-dialog'].showModal();
  selectQrMode(lastData?.guiSettings?.qrFormat === 'amnezia');
}
elements['qr-dialog'].addEventListener('close', stopQrAnimation);
elements['close-qr-button'].addEventListener('click', () => elements['qr-dialog'].close());
elements['qr-dialog'].addEventListener('close', () => { elements['qr-image'].removeAttribute('src'); });
elements['create-form'].addEventListener('submit', async (event) => {
  event.preventDefault();
  text(elements['create-error'], '');
  const submit = elements['create-form'].querySelector('[type="submit"]');
  submit.disabled = true;
  try {
    await request('/api/wireguard/client', { method: 'POST', body: JSON.stringify({ name: elements['client-name'].value, protocol: elements['client-protocol'].value, ...clientModeBody(elements['client-route'].value) }) });
    elements['client-name'].value = '';
    elements['create-panel'].close();
    await refresh();
  } catch (error) { text(elements['create-error'], error.message); }
  finally { submit.disabled = false; }
});

function suggestedUpstreamName() {
  const upstreams = lastData?.routing.upstreams || [];
  const taken = new Set(upstreams.map(({ name }) => name.toLowerCase()));
  for (let index = upstreams.length + 2; ; index++) {
    const name = index <= 26 ? 'Server ' + String.fromCharCode(64 + index) : 'Server ' + index;
    if (!taken.has(name.toLowerCase())) return name;
  }
}

elements['new-upstream-button'].addEventListener('click', () => {
  if (!importPriority.value) importPriority.value = suggestedImportPriority();
  syncImportPriority();
  elements['upstream-name'].placeholder = suggestedUpstreamName();
  text(elements['upstream-error'], '');
  elements['upstream-create-panel'].showModal();
  elements['upstream-name'].focus();
});
elements['cancel-upstream-button'].addEventListener('click', () => {
  elements['upstream-create-panel'].close();
  text(elements['upstream-error'], '');
});
elements['upstream-create-panel'].addEventListener('close', () => text(elements['upstream-error'], ''));
elements['policy-create-panel'].addEventListener('close', resetPolicyEditor);
const importPriority = document.querySelector('#import-priority');
const importFailover = document.querySelector('#import-failover');
function suggestedImportPriority() {
  const priorities = (lastData?.routing.upstreams || []).map(tunnel => tunnel.failoverPriority ?? 0);
  return Math.min(10000, Math.max(0, ...priorities) + 10);
}
function syncImportPriority() {
  document.querySelector('#import-priority-field').classList.toggle('import-priority-disabled', !importFailover.checked);
  importPriority.disabled = !importFailover.checked;
  importPriority.required = importFailover.checked;
}
function readImportPriority() {
  const match = elements['upstream-config'].value.match(/^\s*#\s*FailoverPriority\s*=\s*(\d+)\s*$/im);
  importPriority.value = match?.[1] || suggestedImportPriority();
  importFailover.checked = Boolean(match);
  syncImportPriority();
}
importFailover.addEventListener('change', syncImportPriority);
elements['upstream-config'].addEventListener('input', readImportPriority);
elements['upstream-form'].addEventListener('reset', () => queueMicrotask(syncImportPriority));
const importFile = elements['upstream-file'];
const importFileName = document.querySelector('#upstream-file-name');
document.querySelector('#upstream-file-pick').addEventListener('click', () => importFile.click());
elements['upstream-form'].addEventListener('reset', () => { importFileName.textContent = ''; });
importFile.addEventListener('change', async () => {
  const file = importFile.files[0];
  importFileName.textContent = '';
  if (!file) return;
  try {
    const config = await file.text();
    if (importFile.files[0] !== file) return;
    elements['upstream-config'].value = config;
    importFileName.textContent = file.name;
    readImportPriority();
    text(elements['upstream-error'], '');
  } catch (error) {
    if (importFile.files[0] === file) text(elements['upstream-error'], error.message);
  }
});
elements['upstream-form'].addEventListener('submit', async (event) => {
  event.preventDefault();
  text(elements['upstream-error'], '');
  const submit = elements['upstream-form'].querySelector('[type="submit"]'); submit.disabled = true;
  try {
    await request('/api/routing/upstreams', {
      method: 'POST',
      body: JSON.stringify({ name: elements['upstream-name'].value.trim() || elements['upstream-name'].placeholder || suggestedUpstreamName(), config: elements['upstream-config'].value,
        failoverPriority: importFailover.checked ? Number(importPriority.value) : null,
        ...(elements['upstream-listen-port'].value ? { listenPort: Number(elements['upstream-listen-port'].value) } : {}) }),
    });
    elements['upstream-form'].reset();
    elements['upstream-create-panel'].close();
    await refresh();
  } catch (error) { text(elements['upstream-error'], error.message); }
  finally { submit.disabled = false; }
});

for (const [select, hint] of [['client-route', 'client-route-hint'], ['rename-route', 'rename-route-hint']]) {
  elements[select].addEventListener('change', () => updateClientModeHint(elements[select], elements[hint]));
}

elements['close-rename'].addEventListener('click', () => elements['rename-dialog'].close());
elements['rename-dialog'].addEventListener('close', () => { renamingClientId = null; });
elements['rename-form'].addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!renamingClientId || elements['rename-save'].disabled) return;
  elements['rename-save'].disabled = true;
  text(elements['rename-error'], '');
  try {
    await request(`/api/wireguard/client/${renamingClientId}`, { method: 'PUT', body: JSON.stringify({ name: elements['rename-name'].value, ...clientModeBody(elements['rename-route'].value) }) });
    elements['rename-dialog'].close();
    await refresh();
  } catch (error) { text(elements['rename-error'], error.message); }
  finally { elements['rename-save'].disabled = false; }
});

elements['config-copy'].addEventListener('click', async () => {
  const value = elements['config-text'].value;
  if (!value || elements['config-copy'].hidden) return;
  text(elements['config-error'], '');
  try {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(value); copied = true; } catch (_) { /* HTTP/browser fallback below. */ }
    }
    if (!copied) {
      const input = document.createElement('textarea');
      input.value = value; input.className = 'clipboard-helper';
      elements['config-dialog'].append(input);
      try { input.focus(); input.select(); copied = document.execCommand('copy'); }
      finally { input.remove(); elements['config-copy'].focus(); }
    }
    if (!copied) throw new Error('copy failed');
    if (elements['config-dialog'].open) text(elements['config-copy'], 'Copied');
  } catch (_) { text(elements['config-error'], 'Could not copy. Select and copy the text manually.'); }
});

elements['close-config-button'].addEventListener('click', () => elements['config-dialog'].close());
elements['config-dialog'].addEventListener('close', () => {
  if (exportClient) {
    exportClient = null;
    exportMode.hidden = true;
    elements['config-dialog'].classList.remove('export-dialog');
    exportQr.hidden = true;
    stopQrAnimation();
    elements['qr-image'].removeAttribute('src');
    elements['qr-dialog'].append(qrContent);
  }
  configViewController?.abort();
  configViewController = null;
  elements['config-vpn-text'].textContent = '';
  elements['config-vpn-text'].hidden = true;
  elements['config-copy'].hidden = true;
  text(elements['config-copy'], 'Copy');
  elements['config-download'].hidden = true;
  elements['config-download'].removeAttribute('href');
  elements['config-text'].value = '';
  elements['config-text'].hidden = true;
  elements['config-loading'].hidden = true;
  text(elements['config-error'], '');
});

elements['close-peer-connection'].addEventListener('click', () => elements['peer-connection-dialog'].close());
elements['peer-connection-enabled'].addEventListener('change', updatePeerConnectionFields);
elements['peer-connection-dialog'].addEventListener('close', () => { editingPeerId = null; });
elements['peer-connection-form'].addEventListener('submit', async (event) => {
  event.preventDefault();
  text(elements['peer-connection-error'], '');
  try {
    const reverseInitiation = elements['peer-connection-enabled'].checked ? {
      endpoint: elements['peer-connection-endpoint'].value.trim(),
      persistentKeepalive: Number(elements['peer-connection-keepalive'].value),
    } : null;
    await request(`/api/wireguard/client/${editingPeerId}/connection`, { method: 'PUT', body: JSON.stringify({ reverseInitiation }) });
    elements['peer-connection-dialog'].close();
    await refresh();
  } catch (error) { text(elements['peer-connection-error'], error.message); }
});

elements['new-policy-button'].addEventListener('click', () => openPolicyEditor());
elements['cancel-policy-button'].addEventListener('click', () => {
  elements['policy-create-panel'].close();
  resetPolicyEditor();
});
elements['policy-form'].addEventListener('submit', async (event) => {
  event.preventDefault();
  text(elements['policy-error'], '');
  const submit = elements['policy-form'].querySelector('[type="submit"]'); submit.disabled = true;
  try {
    await request(editingPolicyId ? `/api/routing/policies/${editingPolicyId}` : '/api/routing/policies', {
      method: editingPolicyId ? 'PUT' : 'POST',
      body: JSON.stringify({
        name: elements['policy-name'].value,
        priority: Number(elements['policy-priority'].value),
        route: routeFromValue(elements['policy-route'].value),
        domains: listValues(elements['policy-domains'].value),
        networks: listValues(elements['policy-networks'].value),
      }),
    });
    elements['policy-create-panel'].close();
    resetPolicyEditor();
    await refresh();
  } catch (error) { text(elements['policy-error'], error.message); }
  finally { submit.disabled = false; }
});

const routeControl = id => document.getElementById(id);
let routeMode = 'fixed';
let routeSaving = false;
function routeFact(id, label, value, tone = '') {
  const strong = document.createElement('strong');
  strong.className = tone;
  strong.textContent = value;
  routeControl(id).replaceChildren(t(label, { name: '' }), strong);
}
function renderRouteMode(routing) {
  const saved = routing.failover.config.enabled ? 'automatic' : 'fixed';
  routeMode = saved;
  text(routeControl('operating-mode-hint'), saved === 'fixed'
    ? 'Uses the selected direction for automatic clients when no routing rule matches. It does not switch tunnels.'
    : 'For automatic clients outside routing rules, switches to an available tunnel based on priority.');
  for (const mode of ['fixed', 'automatic']) {
    const button = routeControl('mode-' + mode);
    button.classList.toggle('primary', mode === routeMode);
    button.classList.toggle('secondary', mode !== routeMode);
    button.setAttribute('aria-pressed', String(mode === routeMode));
    button.disabled = routeSaving;
  }
  routeControl('route-fixed').hidden = routeMode !== 'fixed';
  routeControl('route-automatic').hidden = routeMode !== 'automatic';
  elements['default-route'].disabled = routeMode !== 'fixed' || routeSaving;
  routeControl('save-fixed-route').disabled = routeSaving || !defaultRouteDirty;
  routeControl('route-draft').hidden = !defaultRouteDirty;
  const eligible = routing.upstreams.filter(u => u.enabled && u.failoverPriority != null).sort((a,b) => a.failoverPriority-b.failoverPriority);
  const preferred = eligible[0];
  routeFact('route-preferred', 'Preferred: {name}', preferred?.name || '—');
  const duplicates = eligible.some((u, i) => i > 0 && u.failoverPriority === eligible[i - 1].failoverPriority);
  routeControl('route-duplicate').hidden = !duplicates;
  const autoReturn = routing.failover.config.autoFailback;
  routeFact('route-return', 'Automatic return: {name}', t(autoReturn ? 'enabled' : 'disabled'), autoReturn ? 'upstream-failover-on' : 'upstream-failover-off');
  routeControl('fixed-priority-note').hidden = saved !== 'fixed';
  routeControl('upstreams-title').textContent = t(saved === 'fixed' ? 'Upstream tunnels' : 'Upstream tunnels and failover');
  routeControl('upstream-rows').closest('table').classList.toggle('fixed-route-table', saved === 'fixed');
  const direction = routeFromValue(elements['default-route'].value);
  text(routeControl('route-hint'), direction.type === 'direct' ? 'Traffic exits directly through Server A.'
    : direction.type === 'blocked' ? 'Unmatched traffic is blocked.'
      : 'Traffic uses only {name}. If unavailable, traffic is blocked.', {name: routeLabel(direction, routing.upstreams)});
}
async function saveRouteMode(mode, route) {
  if (routeSaving || !lastData) return;
  routeSaving = true;
  renderRouteMode(lastData.routing);
  text(elements['default-route-error'], '');
  try {
    await request('/api/routing/mode', {
      method: 'PUT', body: JSON.stringify({ mode, route }),
    });
    defaultRouteDirty = false;
    await refresh();
  } catch (error) { text(elements['default-route-error'], error.message); }
  finally {
    routeSaving = false;
    renderRouteMode(lastData.routing);
  }
}
for (const mode of ['fixed','automatic']) routeControl('mode-'+mode).addEventListener('click', async () => {
  if (!lastData || mode === routeMode || routeSaving) return;
  const fixed = mode === 'fixed';
  if (await confirmAction('Change operating mode', fixed
    ? 'Switch to the saved fixed route? Automatic failover will stop. Active connections may need to reconnect.'
    : 'Enable automatic failover? The default route will be selected by tunnel priority and availability. Active connections may need to reconnect.',
  'Change mode')) await saveRouteMode(mode, lastData.routing.defaultRoute);
});
elements['default-route'].addEventListener('change', () => {
  defaultRouteDirty = elements['default-route'].value !== routeValue(lastData.routing.defaultRoute);
  renderRouteMode(lastData.routing);
});
routeControl('open-failover').addEventListener('click', () => elements['failover-settings'].showModal());
routeControl('close-failover').addEventListener('click', () => elements['failover-settings'].close());
elements['default-route-form'].addEventListener('submit', (event) => {
  event.preventDefault();
  if (routeMode === 'fixed' && defaultRouteDirty) saveRouteMode('fixed', routeFromValue(elements['default-route'].value));
});

const settingsDirty = { server: false, dns: false, qr: false };
let dnsDraft = [];
let dnsTestResults = null;
let dnsTesting = false;
function renderDnsTestResults() {
  for (const row of elements['dns-settings-rows'].children) {
    const address = row.querySelector('input').value.trim();
    const result = dnsTestResults?.find(result => result.address === address);
    const status = row.querySelector('.dns-check-status');
    status.textContent = dnsTesting ? t('Testing…') : result ? (result.success ? t('{ms} ms', { ms: result.milliseconds }) : t('No response')) : '—';
    status.classList.toggle('form-error', result?.success === false && !dnsTesting);
  }
}
function validDnsAddress(address) {
  const parts = address.split('.');
  return parts.length === 4 && parts.every(part => /^(0|[1-9][0-9]{0,2})$/.test(part) && Number(part) <= 255) && !/^(0|127|22[4-9]|2[3-5][0-9])\./.test(address);
}
function validateDnsDraft() {
  const counts = new Map(); dnsDraft.forEach(address => counts.set(address, (counts.get(address) || 0) + 1));
  let valid = dnsDraft.length > 0;
  const selfAddresses = Object.values(lastData?.status.addresses || {}).map(address => address.split('/')[0]);
  [...elements['dns-settings-rows'].querySelectorAll('input')].forEach((input, index) => {
    const address = dnsDraft[index];
    const error = !validDnsAddress(address) ? 'Enter a valid IPv4 address (four numbers from 0 to 255).' : counts.get(address) > 1 ? 'DNS addresses must be unique.' : selfAddresses.includes(address) ? 'DNS server cannot point to this VPN DNS proxy' : '';
    input.setCustomValidity(error ? t(error) : ''); input.setAttribute('aria-invalid', String(Boolean(error))); input.title = error ? t(error) : '';
    if (error) valid = false;
  });
  elements['dns-settings-form'].querySelector('[type="submit"]').disabled = !valid;
  elements['dns-test'].disabled = !valid || dnsTesting;
  return valid;
}
window.addEventListener('awg-language-change', () => { renderDnsDraft(); renderDnsTestResults(); });
function renderDnsDraft() {
  const rows = elements['dns-settings-rows']; rows.replaceChildren();
  dnsDraft.forEach((address, index) => {
    const row = document.createElement('tr');
    const priority = document.createElement('td'); priority.textContent = `${index + 1} — ${t(index === 0 ? 'Primary' : 'Backup')}`;
    const addressCell = document.createElement('td');
    const input = document.createElement('input'); input.value = address; input.required = true; input.spellcheck = false; input.inputMode = 'decimal'; input.autocomplete = 'off'; input.maxLength = 15; input.placeholder = '0.0.0.0'; input.pattern = '(?:[0-9]{1,3}\\.){3}[0-9]{1,3}'; input.setAttribute('aria-label', t('IPv4 address'));
    input.addEventListener('beforeinput', event => {
      if (event.inputType !== 'insertText' || !event.data || event.data.length > 1) return;
      event.preventDefault();
      if (!/^[0-9.]$/.test(event.data)) return;
      const start = input.selectionStart, end = input.selectionEnd;
      const prefix = input.value.slice(0, start), suffix = input.value.slice(end);
      if (event.data === '.' && prefix.endsWith('.')) return;
      const candidate = prefix + event.data + suffix;
      const parts = candidate.split('.');
      if (parts.length > 4 || parts.some(part => part && (!/^[0-9]{1,3}$/.test(part) || Number(part) > 255 || (part.length > 1 && part.startsWith('0'))))) return;
      if (event.data === '.' && (!prefix || prefix.endsWith('.'))) return;
      input.setRangeText(event.data, start, end, 'end');
      const caret = input.selectionStart, left = input.value.slice(0, caret), right = input.value.slice(caret);
      const current = left.split('.').pop();
      if (event.data !== '.' && left.split('.').length < 4 && (current.length === 3 || Number(current) > 25 || current === '0')) {
        if (right.startsWith('.')) input.setSelectionRange(caret + 1, caret + 1);
        else if (!right) input.setRangeText('.', caret, caret, 'end');
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    input.addEventListener('input', () => { dnsDraft[index] = input.value.trim(); settingsDirty.dns = true; validateDnsDraft(); renderDnsTestResults(); }); addressCell.append(input);
    const actions = document.createElement('td'); const group = document.createElement('div'); group.className = 'row-actions';
    for (const [label, offset] of [['Move up', -1], ['Move down', 1]]) {
      const control = button(label, 'secondary', () => { const target = index + offset; [dnsDraft[index], dnsDraft[target]] = [dnsDraft[target], dnsDraft[index]]; settingsDirty.dns = true; renderDnsDraft(); });
      control.disabled = index + offset < 0 || index + offset >= dnsDraft.length; group.append(control);
    }
    const remove = button('Remove', 'danger', () => { dnsDraft.splice(index, 1); settingsDirty.dns = true; renderDnsDraft(); }); remove.disabled = dnsDraft.length === 1; group.append(remove); actions.append(group);
    const status = document.createElement('td'); status.className = 'dns-check-status numeric';
    row.append(priority, addressCell, status, actions); rows.append(row);
  });
  elements['dns-add'].disabled = dnsDraft.length >= 8;
  validateDnsDraft(); renderDnsTestResults();
}
function renderGuiSettings(value) {
  if (!value) return;
  if (!settingsDirty.server) {
    elements['settings-server-name'].value = value.serverName;
    elements['settings-panel-name'].value = value.panelName || '';
  }
  if (!settingsDirty.qr) elements['settings-qr-format'].value = value.qrFormat;
  if (!settingsDirty.dns && document.activeElement?.closest('#dns-settings-form') === null) {
    dnsDraft = [...value.dnsUpstreams]; renderDnsDraft();
  }
}
for (const [form, key] of [['server-settings-form','server'], ['dns-settings-form','dns'], ['qr-settings-form','qr']]) {
  elements[form].addEventListener('input', () => { settingsDirty[key] = true; });
  elements[form].addEventListener('change', () => { settingsDirty[key] = true; });
  elements[form].addEventListener('submit', async event => {
    event.preventDefault();
    if (key === 'dns' && !validateDnsDraft()) return;
    const message = elements[`${key === 'server' ? 'server' : key}-settings-message`];
    const body = key === 'server' ? { serverName: elements['settings-server-name'].value, panelName: elements['settings-panel-name'].value } : key === 'dns' ? { dnsUpstreams: dnsDraft } : { qrFormat: elements['settings-qr-format'].value };
    const submit = elements[form].querySelector('[type="submit"]'); submit.disabled = true;
    try {
      await request('/api/settings', { method: 'PUT', body: JSON.stringify(body) });
      settingsDirty[key] = false; text(message, 'Settings saved.'); await refresh();
    } catch(error) { text(message, error.message); }
    finally { submit.disabled = false; if (key === 'dns') validateDnsDraft(); }
  });
}
elements['dns-add'].addEventListener('click', () => { if (dnsDraft.length < 8) { dnsDraft.push(''); settingsDirty.dns = true; renderDnsDraft(); elements['dns-settings-rows'].lastElementChild.querySelector('input').focus(); } });
elements['dns-test'].addEventListener('click', async () => {
  if (!validateDnsDraft()) return;
  dnsTestResults = null; dnsTesting = true; renderDnsTestResults(); elements['dns-test'].disabled = true; text(elements['dns-settings-message'], '');
  try {
    const { results } = await request('/api/settings/dns/test', { method: 'POST', body: JSON.stringify({ servers: dnsDraft }) });
    dnsTestResults = results; renderDnsTestResults();
  } catch(error) { text(elements['dns-settings-message'], error.message); }
  finally { dnsTesting = false; renderDnsTestResults(); validateDnsDraft(); }
});
elements['failover-form'].addEventListener('input', () => { failoverFormDirty = true; });
elements['failover-form'].addEventListener('change', () => { failoverFormDirty = true; });
elements['failover-form'].addEventListener('submit', async (event) => {
  event.preventDefault();
  text(elements['failover-error'], '');
  try {
    await request('/api/routing/failover', {
      method: 'PUT', body: JSON.stringify({
        intervalSeconds: Number(elements['failover-interval'].value),
        timeoutSeconds: Number(elements['failover-timeout'].value),
        failureThreshold: Number(elements['failover-failures'].value),
        recoveryThreshold: Number(elements['failover-recovery'].value),
        autoFailback: elements['failover-auto-return'].checked,
        targets: elements['failover-targets'].value.split('\n').map((item) => item.trim()).filter(Boolean),
      }),
    });
    failoverFormDirty = false;
    showMessage('Settings saved.');
    await refresh();
  } catch (error) { text(elements['failover-error'], error.message); }
});
elements['failover-return'].addEventListener('click', async () => {
  try { await request('/api/routing/failover/preferred', { method: 'POST' }); await refresh(); }
  catch (error) { showMessage(error.message); }
});

request('/api/session')
  .then((session) => session.authenticated ? showApp() : showLogin())
  .catch(() => showLogin());
