## GymBox

---

### Outline

---

**GymBox** - 사용자 맞춤형 운동 정보와 커뮤니티를 제공하는 올인원 헬스 플랫폼.

- **헬스 피드백 게시판** - 유저가 자신의 운동 영상을 업로드하고 다른 사용자들로부터 피드백을 받을 수 있는 게시판입니다.
- **트레이너 추천 및 챗봇** - 사용자의 운동 관심사에 따라 맞춤형 트레이너를 추천해주며, GPT 기반 AI 챗봇을 통해 운동 계획, 식단 조언, 트레이닝 팁을 제공합니다.
- **헬스 관련 뉴스 배너** - 최신 헬스 트렌드, 연구 결과, 운동 및 건강 관련 기사 제공
- **단백질 랭킹 시스템** - 커뮤니티 활동으로 받을 수 있는 단백질 포인트 레벨 및 랭킹 시스템

### Team

---

**Backend**

이현서 (고려대학교 컴퓨터학과 21학번)

[github.com/ss-leg-al](http://github.com/ss-leg-al)

**Frontend**

진예환 (카이스트 전자과 21학번)

[github.com/YeahwanJin](https://github.com/YeahwanJin)

### Tech Stack

---

**프론트엔드** : React, Typescript, CSS

**백엔드** : Node.js,Express.js, MongoDB, mongoose, Postman

**협업 툴** : Git, Github, Figma, Notion

### Model Schema

---

1. User

| 필드 | 타입 | 설명 | 제약 조건 |
| --- | --- | --- | --- |
| name | String | 사용자의 이름 | 필수 |
| email | String | 사용자의 이메일 주소 | 필수, 고유 |
| points | Number | 사용자의 포인트 | 기본값: 0 |
| level | String | 사용자의 레벨 | 열거형: ['Bronze', 'Silver', 'Gold'], 기본값: Bronze |
| favoriteTrainers | Array of ObjectId references to Trainer | 사용자의 관심 트레이너 목록 | Trainer 모델을 참조 |
| createdAt | Date | 생성 타임스탬프 | 자동 관리 |
| updatedAt | Date | 마지막 업데이트 타임스탬프 | 자동 관리 |
1. Post

| 필드 | 타입 | 설명 | 제약 조건 |
| --- | --- | --- | --- |
| title | String | 포스트의 제목 | 필수 |
| content | String | 포스트의 내용 | 필수 |
| videoUrl | String | 포스트에 포함된 비디오 URL | 선택 |
| imageUrl | String | 포스트에 포함된 이미지 URL | 선택 |
| authorId | ObjectId (User 참조) | 포스트 작성자의 사용자 ID | 필수, User 모델을 참조 |
| likes | Number | 포스트의 좋아요 수 | 기본값: 0 |
| likedBy | Array of ObjectId (User 참조) | 포스트를 좋아요한 사용자 목록 | User 모델을 참조 |
| createdAt | Date | 생성 타임스탬프 | 자동 관리 |
| updatedAt | Date | 마지막 업데이트 타임스탬프 | 자동 관리 |
1. Comment

| 필드 | 타입 | 설명 | 제약 조건 |
| --- | --- | --- | --- |
| postId | ObjectId (Post 참조) | 댓글이 속한 포스트의 ID | 필수, Post 모델을 참조 |
| commenterId | ObjectId (User 참조) | 댓글 작성자의 사용자 ID | 필수, User 모델을 참조 |
| content | String | 댓글의 내용 | 필수 |
| pointsGiven | Number | 댓글에 주어진 포인트 수 | 필수 |
| createdAt | Date | 생성 타임스탬프 | 자동 관리 |
| updatedAt | Date | 마지막 업데이트 타임스탬프 | 자동 관리 |
1. Trainer

| 필드 | 타입 | 설명 | 제약 조건 |
| --- | --- | --- | --- |
| id | Number | 트레이너의 고유 식별자 | 고유, 필수 |
| name | String | 트레이너의 이름 | 필수 |
| gender | String | 트레이너의 성별 | 열거형: ['male', 'female'], 필수 |
| category | String | 트레이너의 전문 분야 | 열거형: ['diet', 'rehabilitation', 'strength'], 필수 |
| image | String | 트레이너의 이미지 URL | 필수 |
| shortDescription | String | 트레이너의 간단한 설명 | 필수 |
| detailedDescription | String | 트레이너의 상세한 설명 | 필수 |
| createdAt | Date | 생성 타임스탬프 | 자동 관리 |
| updatedAt | Date | 마지막 업데이트 타임스탬프 | 자동 관리 |

### **API**

1.User

| 엔드포인트 | 메서드 | 설명 |
| --- | --- | --- |
| /api/users | GET | 모든 사용자 조회 |
| /api/users/rankings | GET | 사용자 포인트 기준 순위 조회 |
| /api/users/:id | GET | 단일 사용자 조회 |
| /api/users | POST | 새로운 사용자 생성 |
| /api/users/:id | PUT | 특정 사용자의 포인트 업데이트 |
| /api/users/update-levels | PATCH | 모든 사용자의 레벨 일괄 업데이트 |
| /api/users/:id/level | GET | 특정 사용자의 레벨 조회 |
| /api/users/:id/favoriteTrainers/:trainerId | POST | 사용자의 관심 트레이너 추가 |
| /api/users/:id/favoriteTrainers/:trainerId | DELETE | 사용자의 관심 트레이너 삭제 |
| /api/users/:id/favoriteTrainers | GET | 사용자의 관심 트레이너 목록 조회 |

2.Post

| 엔드포인트 | 메서드 | 설명 |
| --- | --- | --- |
| /api/posts | GET | 모든 포스트 조회 |
| /api/posts/search | GET | 포스트 검색 |
| /api/posts/:id | GET | 단일 포스트 조회 |
| /api/posts | POST | 새로운 포스트 생성 (이미지 업로드 포함) |
| /api/posts/:id/like | PATCH | 특정 포스트에 좋아요 추가 |
| /api/posts/:id | DELETE | 특정 포스트 삭제 |

3.Comment

| 엔드포인트 | 메서드 | 설명 |
| --- | --- | --- |
| /api/posts/:postId/comments | POST | 특정 포스트에 댓글 작성 |
| /api/posts/:postId/comments | GET | 특정 포스트의 모든 댓글 조회 |
| /api/comments/comments/:commentId | DELETE | 특정 댓글 삭제 |

4.Trainer

| 필드 | 타입 | 설명 | 제약 조건 |
| --- | --- | --- | --- |
| id | Number | 트레이너의 고유 식별자 | 고유, 필수 |
| name | String | 트레이너의 이름 | 필수 |
| gender | String | 트레이너의 성별 | 열거형: ['male', 'female'], 필수 |
| category | String | 트레이너의 전문 분야 | 열거형: ['diet', 'rehabilitation', 'strength'], 필수 |
| image | String | 트레이너의 이미지 URL | 필수 |
| shortDescription | String | 트레이너의 간단한 설명 | 필수 |
| detailedDescription | String | 트레이너의 상세한 설명 | 필수 |
| createdAt | Date | 생성 타임스탬프 | 자동 관리 |
| updatedAt | Date | 마지막 업데이트 타임스탬프 | 자동 관리 |

### 외부 API

---

1. OpenAI ChatGPT

| 엔드포인트 | 메서드 | 설명 |
| --- | --- | --- |
| /api/chatbot | POST | 건강 관련 조언을 제공하는 챗봇과 대화하기 |

2. Naver News

| 엔드포인트 | 메서드 | 설명 |
| --- | --- | --- |
| /api/news | GET | 네이버 뉴스 검색 API를 통해 뉴스 기사 검색 |
1. Google Login

| 엔드포인트z | 메서드 | 설명 |
| --- | --- | --- |
| /api/auth/google | GET | GET	구글 로그인 시작 및 인증 요청 |
| /api/auth/google/redirect | GET | GET	구글 로그인 후 리디렉션 처리 |


<img width="1204" alt="Image" src="https://github.com/user-attachments/assets/6cbb9978-9ab4-4e2e-94d8-2461518115cd" />

<img width="1204" alt="Image" src="https://github.com/user-attachments/assets/478fecd2-e9d6-4120-8e09-f398d5c873ca" />

<img width="1204" alt="Image" src="https://github.com/user-attachments/assets/187576d8-d4b2-4ffe-b413-c86e6cdf40e5" />

<img width="1204" alt="Image" src="https://github.com/user-attachments/assets/d081d2e7-0acc-4039-bc86-61e08697c07f" />

<img width="1204" alt="Image" src="https://github.com/user-attachments/assets/7738eabc-c14b-4edd-a89b-5d655d0f8140" />

<img width="1204" alt="Image" src="https://github.com/user-attachments/assets/e091dabc-5d33-4e54-85da-e8034f12e07c" />

<img width="1204" alt="Image" src="https://github.com/user-attachments/assets/fa9c637f-991b-4b20-a38c-79555bb582ab" />

<img width="1204" alt="Image" src="https://github.com/user-attachments/assets/6eabee09-849c-499a-a5f3-148e186fd82f" />

<img width="1204" alt="Image" src="https://github.com/user-attachments/assets/a2eac41b-2265-4f27-8e88-2f3505ea2bd9" />

<img width="1204" alt="Image" src="https://github.com/user-attachments/assets/cde6ddc7-cc99-4a48-8f5c-98cedeb5c6cd" />
