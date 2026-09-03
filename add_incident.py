from app.db.cosmos.connection import container


incidents = [
    {
        "id": "INC-2026-0003",
        "incident_id": "INC-2026-0003",
        "type": "Suspicious PowerShell Activity",
        "status": "IN_PROGRESS",
        "severity": "HIGH",
        "description": "Encoded PowerShell activity was detected on a corporate workstation.",
        "logs": """2026-09-02 11:03:17 HOST=DEV-221 USER=analyst PROCESS=powershell.exe
2026-09-02 11:03:18 COMMAND=EncodedCommand ACTION=EXECUTE
2026-09-02 11:03:21 NETWORK_CONNECTION=203.0.113.45:443""",
        "indicators": """203.0.113.45
powershell.exe
EncodedCommand""",
        "findings": [
            "Encoded PowerShell command detected",
            "Outbound connection followed command execution",
        ],
    },
    {
        "id": "INC-2026-0004",
        "incident_id": "INC-2026-0004",
        "type": "Phishing Attempt",
        "status": "IN_PROGRESS",
        "severity": "MEDIUM",
        "description": "A suspicious email containing a credential harvesting link was reported by an employee.",
        "logs": """2026-09-02 12:27:41 USER=employee@company.local EMAIL_ACTION=OPENED
2026-09-02 12:27:45 URL=https://login-example.invalid/verify CREDENTIAL_PROMPT=TRUE
2026-09-02 12:28:02 REPORT=USER_REPORTED_PHISHING""",
        "indicators": """login-example.invalid
185.199.108.153
credential-harvesting URL""",
        "findings": [
            "Suspicious credential harvesting URL detected",
            "User reported phishing email",
        ],
    },
    {
        "id": "INC-2026-0005",
        "incident_id": "INC-2026-0005",
        "type": "Data Exfiltration",
        "status": "IN_PROGRESS",
        "severity": "CRITICAL",
        "description": "Unusual outbound data transfer was detected from an internal database server.",
        "logs": """2026-09-02 13:42:11 HOST=DB-01 DEST=198.51.100.27:443 BYTES_OUT=524288000
2026-09-02 13:42:17 PROCESS=backup_sync.exe USER=svc_backup
2026-09-02 13:43:03 ALERT=UNUSUAL_OUTBOUND_TRANSFER""",
        "indicators": """198.51.100.27
DB-01
backup_sync.exe
500MB outbound transfer""",
        "findings": [
            "Large outbound transfer detected",
            "Destination was not previously observed",
        ],
    },
    {
        "id": "INC-2026-0006",
        "incident_id": "INC-2026-0006",
        "type": "Brute Force Attack",
        "status": "IN_PROGRESS",
        "severity": "HIGH",
        "description": "Repeated failed authentication attempts were detected against a corporate account.",
        "logs": """2026-09-02 14:18:01 USER=admin@company.local SOURCE=10.20.5.77 RESULT=FAILED
2026-09-02 14:18:03 USER=admin@company.local SOURCE=10.20.5.77 RESULT=FAILED
2026-09-02 14:18:05 USER=admin@company.local SOURCE=10.20.5.77 RESULT=FAILED
2026-09-02 14:18:07 USER=admin@company.local SOURCE=10.20.5.77 RESULT=SUCCESS""",
        "indicators": """10.20.5.77
admin@company.local
Multiple failed authentications""",
        "findings": [
            "Repeated failed login attempts detected",
            "Successful authentication followed multiple failures",
        ],
    },
]


for incident in incidents:
    container.create_item(body=incident)
    print(f"Added: {incident['id']}")


print("4 incidents added successfully")