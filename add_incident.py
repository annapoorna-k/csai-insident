from app.db.cosmos.connection import container


incidents = [

    {
        "id": "INC-2026-0007",
        "incident_id": "INC-2026-0007",
        "type": "Malware Detection",
        "status": "IN_PROGRESS",
        "severity": "HIGH",
        "description": "A suspicious executable was detected and launched on a corporate endpoint.",
        "logs": """2026-09-03 09:12:14 HOST=WKSTN-104 USER=john@company.local FILE=invoice_update.exe
2026-09-03 09:12:18 PROCESS=invoice_update.exe ACTION=EXECUTE
2026-09-03 09:12:21 PROCESS=invoice_update.exe NETWORK_CONNECTION=198.51.100.44:443
2026-09-03 09:12:27 AV_ALERT=MALWARE_DETECTED""",
        "indicators": """198.51.100.44
invoice_update.exe
SHA256=7f8a9c2d1e4b6a88""",
        "findings": [
            "Unknown executable was launched",
            "Outbound network connection followed execution",
            "Endpoint security detected malware activity",
        ],
    },

    {
        "id": "INC-2026-0008",
        "incident_id": "INC-2026-0008",
        "type": "Ransomware Activity",
        "status": "IN_PROGRESS",
        "severity": "CRITICAL",
        "description": "Multiple files were rapidly encrypted on a shared corporate workstation.",
        "logs": """2026-09-03 09:35:01 HOST=FS-021 USER=finance@company.local FILE_OPERATION=ENCRYPT
2026-09-03 09:35:04 HOST=FS-021 FILES_MODIFIED=1842
2026-09-03 09:35:09 PROCESS=unknown.exe CPU=98%
2026-09-03 09:35:15 ALERT=RANSOMWARE_BEHAVIOR""",
        "indicators": """unknown.exe
FS-021
1842 modified files
Ransomware behavior""",
        "findings": [
            "Large number of files modified in a short period",
            "Unknown process consumed excessive CPU",
            "Ransomware behavior alert generated",
        ],
    },

    {
        "id": "INC-2026-0009",
        "incident_id": "INC-2026-0009",
        "type": "SQL Injection Attempt",
        "status": "IN_PROGRESS",
        "severity": "HIGH",
        "description": "Repeated SQL injection payloads were detected against a public web application.",
        "logs": """2026-09-03 10:02:11 SOURCE=203.0.113.72 URI=/login?user=' OR '1'='1
2026-09-03 10:02:13 SOURCE=203.0.113.72 URI=/products?id=1 UNION SELECT
2026-09-03 10:02:18 WAF_ACTION=BLOCK
2026-09-03 10:02:21 ALERT=SQL_INJECTION""",
        "indicators": """203.0.113.72
SQL injection payload
UNION SELECT
WAF blocked request""",
        "findings": [
            "SQL injection payload detected",
            "Multiple malicious requests originated from the same source",
            "Web application firewall blocked the requests",
        ],
    },

    {
        "id": "INC-2026-0010",
        "incident_id": "INC-2026-0010",
        "type": "Port Scanning Activity",
        "status": "IN_PROGRESS",
        "severity": "MEDIUM",
        "description": "An external host performed a high-volume scan against corporate network ports.",
        "logs": """2026-09-03 10:21:02 SOURCE=198.51.100.91 DESTINATION=10.20.10.0/24
2026-09-03 10:21:05 PORT_SCAN=TRUE PORTS=22,80,443,445
2026-09-03 10:21:11 CONNECTION_ATTEMPTS=428
2026-09-03 10:21:15 FIREWALL_ACTION=BLOCK""",
        "indicators": """198.51.100.91
Port 22
Port 80
Port 443
Port 445""",
        "findings": [
            "High-volume port scanning detected",
            "Multiple internal hosts were targeted",
            "Firewall blocked the scanning source",
        ],
    },

    {
        "id": "INC-2026-0011",
        "incident_id": "INC-2026-0011",
        "type": "Credential Theft",
        "status": "IN_PROGRESS",
        "severity": "HIGH",
        "description": "User credentials may have been exposed after interaction with a suspicious authentication page.",
        "logs": """2026-09-03 10:44:31 USER=alice@company.local EMAIL_ACTION=OPENED
2026-09-03 10:44:37 URL=https://secure-login-example.invalid/auth
2026-09-03 10:44:49 CREDENTIAL_PROMPT=TRUE
2026-09-03 10:45:03 USER_REPORT=PHISHING_SUSPECTED""",
        "indicators": """secure-login-example.invalid
alice@company.local
Credential harvesting page""",
        "findings": [
            "User accessed a suspicious authentication page",
            "Credential prompt was detected",
            "User reported the activity as suspicious",
        ],
    },

    {
        "id": "INC-2026-0012",
        "incident_id": "INC-2026-0012",
        "type": "Suspicious DNS Activity",
        "status": "IN_PROGRESS",
        "severity": "MEDIUM",
        "description": "A workstation generated repeated DNS requests to an unusual external domain.",
        "logs": """2026-09-03 11:03:12 HOST=WKSTN-087 DNS_QUERY=update-service-example.invalid
2026-09-03 11:03:14 HOST=WKSTN-087 DNS_QUERY=update-service-example.invalid
2026-09-03 11:03:16 HOST=WKSTN-087 DNS_QUERY=update-service-example.invalid
2026-09-03 11:03:21 DNS_ALERT=SUSPICIOUS_DOMAIN""",
        "indicators": """update-service-example.invalid
WKSTN-087
Repeated DNS queries""",
        "findings": [
            "Repeated DNS requests to an unusual domain",
            "Domain was not previously observed",
            "Security monitoring flagged suspicious DNS behavior",
        ],
    },

    {
        "id": "INC-2026-0013",
        "incident_id": "INC-2026-0013",
        "type": "Privilege Escalation",
        "status": "IN_PROGRESS",
        "severity": "HIGH",
        "description": "A standard user account attempted to obtain administrative privileges on a workstation.",
        "logs": """2026-09-03 11:27:04 USER=employee@company.local HOST=WKSTN-115
2026-09-03 11:27:08 PROCESS=cmd.exe ACTION=RUNAS
2026-09-03 11:27:13 PRIVILEGE_REQUEST=ADMIN
2026-09-03 11:27:17 ALERT=PRIVILEGE_ESCALATION_ATTEMPT""",
        "indicators": """employee@company.local
WKSTN-115
runas
Administrative privilege request""",
        "findings": [
            "Standard user attempted privilege escalation",
            "Administrative privilege was requested",
            "Security monitoring detected suspicious privilege activity",
        ],
    },

    {
        "id": "INC-2026-0014",
        "incident_id": "INC-2026-0014",
        "type": "DDoS Activity",
        "status": "IN_PROGRESS",
        "severity": "CRITICAL",
        "description": "A large volume of inbound requests targeted the corporate public web service.",
        "logs": """2026-09-03 12:01:11 DEST=WEB-01 REQUESTS_PER_SEC=12450
2026-09-03 12:01:19 DEST=WEB-01 REQUESTS_PER_SEC=18720
2026-09-03 12:01:27 DEST=WEB-01 REQUESTS_PER_SEC=21340
2026-09-03 12:01:35 ALERT=TRAFFIC_SPIKE""",
        "indicators": """WEB-01
21340 requests/sec
Distributed source addresses
Traffic spike""",
        "findings": [
            "Abnormally high request volume detected",
            "Public web server was targeted",
            "Traffic pattern is consistent with denial-of-service activity",
        ],
    },

    {
        "id": "INC-2026-0015",
        "incident_id": "INC-2026-0015",
        "type": "Unauthorized Access",
        "status": "IN_PROGRESS",
        "severity": "HIGH",
        "description": "A user account successfully authenticated from an unusual geographic location.",
        "logs": """2026-09-03 12:23:41 USER=admin@company.local LOGIN=SUCCESS
2026-09-03 12:23:41 SOURCE_COUNTRY=UNKNOWN
2026-09-03 12:23:43 SOURCE_IP=203.0.113.188
2026-09-03 12:24:02 ALERT=IMPOSSIBLE_TRAVEL""",
        "indicators": """admin@company.local
203.0.113.188
Impossible travel
Unknown source country""",
        "findings": [
            "Successful administrative login detected",
            "Login originated from an unusual location",
            "Impossible-travel detection was triggered",
        ],
    },

    {
        "id": "INC-2026-0016",
        "incident_id": "INC-2026-0016",
        "type": "Web Shell Detection",
        "status": "IN_PROGRESS",
        "severity": "CRITICAL",
        "description": "A suspicious server-side script was discovered on a public web server.",
        "logs": """2026-09-03 12:48:12 HOST=WEB-02 FILE=/var/www/html/upload/cmd.php
2026-09-03 12:48:17 PROCESS=php-fpm ACTION=EXECUTE
2026-09-03 12:48:23 COMMAND=whoami
2026-09-03 12:48:29 ALERT=WEB_SHELL_DETECTED""",
        "indicators": """WEB-02
/var/www/html/upload/cmd.php
cmd.php
Web shell""",
        "findings": [
            "Suspicious PHP file discovered in web directory",
            "Server-side script executed system commands",
            "Web shell behavior was detected",
        ],
    },

    {
        "id": "INC-2026-0017",
        "incident_id": "INC-2026-0017",
        "type": "Data Exfiltration",
        "status": "IN_PROGRESS",
        "severity": "HIGH",
        "description": "A workstation transferred an unusually large amount of sensitive data to an external destination.",
        "logs": """2026-09-03 13:16:01 HOST=WKSTN-204 USER=finance@company.local
2026-09-03 13:16:07 DEST=198.51.100.145:443
2026-09-03 13:16:19 BYTES_OUT=734003200
2026-09-03 13:16:25 ALERT=LARGE_DATA_TRANSFER""",
        "indicators": """198.51.100.145
WKSTN-204
700MB outbound transfer
finance@company.local""",
        "findings": [
            "Large outbound data transfer detected",
            "External destination was unusual",
            "Sensitive department workstation was involved",
        ],
    },

    {
        "id": "INC-2026-0018",
        "incident_id": "INC-2026-0018",
        "type": "Insider Threat",
        "status": "IN_PROGRESS",
        "severity": "MEDIUM",
        "description": "A user accessed an unusually large number of confidential documents outside normal working patterns.",
        "logs": """2026-09-03 13:42:02 USER=employee@company.local FILE_ACCESS=CONFIDENTIAL
2026-09-03 13:42:17 FILES_ACCESSED=386
2026-09-03 13:43:04 DOWNLOAD_SIZE=420MB
2026-09-03 13:43:21 ALERT=UNUSUAL_FILE_ACCESS""",
        "indicators": """employee@company.local
386 confidential files
420MB download
Unusual file access""",
        "findings": [
            "Large number of confidential files accessed",
            "Activity occurred outside the user's normal pattern",
            "Large download was detected",
        ],
    },
]


for incident in incidents:
    container.create_item(body=incident)
    print(f"Added: {incident['id']}")


print(f"{len(incidents)} new incidents added successfully")