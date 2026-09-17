# 생활형 계산기 웹 서비스 기능 명세서 (10대 핵심 기능)

AI 코딩 에이전트(LLM/Code Agent)가 즉시 구현할 수 있도록 **기능 개요, 입력/출력 변수, 수학 공식, 예시 입출력, 엣지 케이스 처리 규칙**을 표준화하여 정리한 명세서입니다.

---

## 1. 더치페이 / N빵 계산기 (Dutch Pay Calculator)

### 1.1 개요
총 결제 금액을 인원수대로 균등 분할하고, 올림/버림 단위(예: 100원 단위, 1,000원 단위)를 적용하여 정산합니다.

### 1.2 입출력 변수
- **입력:**
  - `total_amount` (정수/실수): 총 결제 금액
  - `num_people` (정수): 참여 인원수 ($n \ge 1$)
  - `round_unit` (정수): 절사/올림 단위 (예: `100`, `1000`, 미적용 시 `1`)
  - `round_mode` (문자열): `round_up`(올림), `round_down`(버림), `none`(정밀 분할)
- **출력:**
  - `per_person_amount` (정수/실수): 1인당 부담 금액
  - `difference` (정수/실수): 반올림/절사로 인한 잔여 차액 ($total - per\_person \times n$)

### 1.3 계산 공식
$$\text{raw\_share} = \frac{\text{total\_amount}}{\text{num\_people}}$$

- **올림 (`round_up`):**
  $$\text{per\_person} = \left\lceil \frac{\text{raw\_share}}{\text{round\_unit}} \right\rceil \times \text{round\_unit}$$
- **버림 (`round_down`):**
  $$\text{per\_person} = \left\lfloor \frac{\text{raw\_share}}{\text{round\_unit}} \right\rfloor \times \text{round\_unit}$$
- **차액 계산:**
  $$\text{difference} = \text{total\_amount} - (\text{per\_person} \times \text{num\_people})$$

### 1.4 예시
- **입력:** `total_amount = 53,000`, `num_people = 4`, `round_unit = 100`, `round_mode = "round_down"`
- **계산:** $53,000 / 4 = 13,250$ $\rightarrow$ 100원 단위 버림 적용 시 $13,200$원
- **출력:** `per_person_amount = 13,200`, `difference = 200` (주최자 추가 부담 또는 잔액)

### 1.5 예외 및 엣지 케이스
- `num_people <= 0`일 경우 `InvalidInputException` 반환.

---

## 2. 단위 가격 비교 계산기 (단가 계산기)

### 2.1 개요
용량(g, ml, 개수 등)과 가격이 다른 두 개 이상의 상품 중 어떤 것이 가성비가 높은지 100g, 100ml, 1개당 단가로 표준화하여 비교합니다.

### 2.2 입출력 변수
- **입력:** 상품 객체 배열 `products = [{ id, price, capacity, unit }]`
  - `price` (정수/실수): 상품 가격
  - `capacity` (실수): 용량/수량
  - `unit` (문자열): 단위 (`g`, `kg`, `ml`, `L`, `count`)
- **출력:**
  - `normalized_prices` (배열): 기준 단위(100g, 100ml, 1개)당 가격 정렬 리스트
  - `best_deal_id`: 가장 저렴한 상품 ID
  - `price_diff_percent`: 최저가 상품 대비 타 상품의 가격 차이 비율(%)

### 2.3 계산 공식
1. 기준 단위 변환 계수 ($C$):
   - $kg \rightarrow g$ ($C = 0.001$), $L \rightarrow ml$ ($C = 0.001$)
2. 기준 단위당 단가 ($\text{Unit Price}_{100}$):
   $$\text{Unit Price}_{100} = \left( \frac{\text{price}}{\text{capacity\_in\_base}} \right) \times 100$$
3. 가격 차이율:
   $$\text{diff\_percent} = \frac{\text{Target Price} - \text{Best Price}}{\text{Best Price}} \times 100$$

### 2.4 예시
- **입력:** 
  - A: `price = 8,900`, `capacity = 750`, `unit = "g"`
  - B: `price = 12,000`, `capacity = 1.2`, `unit = "kg"`
- **계산:** 
  - A 단가: $(8,900 / 750) \times 100 = 1,186.67$원/100g
  - B 단가: $(12,000 / 1200) \times 100 = 1,000.00$원/100g
- **출력:** `best_deal_id = "B"`, `A는 B 대비 18.67% 비쌈`

---

## 3. 예·적금 만기 이자 계산기 (단리/복리/세금)

### 3.1 개요
정기예금(일시납) 및 정기적금(월 복합납입)의 만기 시 세전/세후 이자와 실수령액을 계산합니다.

### 3.2 입출력 변수
- **입력:**
  - `type` (문자열): `"deposit"`(예금) 또는 `"savings"`(적금)
  - `principal` (정수): 원금 (예금: 총액, 적금: 월 납입액)
  - `annual_rate` (실수): 연이율 (단위: %, 예: 3.5)
  - `months` (정수): 거치/납입 개월 수
  - `tax_type` (문자열): `"normal"`(일반과세 15.4%), `"preferential"`(세금우대 9.5%), `"free"`(비과세 0%)
- **출력:**
  - `total_principal`: 총 납입 원금
  - `pre_tax_interest`: 세전 이자
  - `tax_amount`: 이자소득세
  - `net_amount`: 만기 실수령액

### 3.3 계산 공식
- **정기예금 세전 이자:**
  $$I_{pre} = \text{principal} \times \left( \frac{\text{annual\_rate}}{100} \right) \times \left( \frac{\text{months}}{12} \right)$$
- **정기적금 세전 이자 (월초불 기준 단리 공식):**
  $$I_{pre} = \text{principal} \times \left( \frac{\text{annual\_rate}}{100} \right) \times \frac{\text{months} \times (\text{months} + 1)}{2 \times 12}$$
- **세금 및 실수령액:**
  $$\text{tax\_rate} = 
  \begin{cases} 
  0.154 & (\text{normal}) \\ 
  0.095 & (\text{preferential}) \\ 
  0.000 & (\text{free}) 
  \end{cases}$$
  $$\text{tax\_amount} = \lfloor I_{pre} \times \text{tax\_rate} \rfloor$$
  $$\text{net\_amount} = \text{total\_principal} + (I_{pre} - \text{tax\_amount})$$

---

## 4. 대출 이자 및 상환액 계산기 (원리금균등 vs 원금균등)

### 4.1 개요
원리금균등분할상환과 원금균등분할상환 방식을 지원하며, 월 상환금과 총 상환 이자를 산출합니다.

### 4.2 입출력 변수
- **입력:**
  - `principal` ($P$): 대출 원금
  - `annual_rate` ($r_{yr}$): 연이자율(%)
  - `months` ($n$): 상환 개월 수
  - `method`: `"amortizing"`(원리금균등) 또는 `"equal_principal"`(원금균등)
- **출력:**
  - `monthly_payments`: 월별 납입 데이터 배열 `[{ month, principal_paid, interest_paid, total_paid, remaining_balance }]`
  - `total_interest`: 대출 기간 총 납입 이자

### 4.3 계산 공식
월이자율 $r = \frac{r_{yr}}{100 \times 12}$

1. **원리금균등분할상환 (Equal Payment):**
   $$\text{Monthly Payment } (M) = P \times \frac{r(1+r)^n}{(1+r)^n - 1}$$
   - $k$회차 이자: $I_k = \text{Balance}_{k-1} \times r$
   - $k$회차 원금: $P_k = M - I_k$
2. **원금균등분할상환 (Equal Principal):**
   - 매월 균등 원금: $P_k = \frac{P}{n}$
   - $k$회차 이자: $I_k = \left( P - (k - 1) \times P_k \right) \times r$
   - $k$회차 납입액: $M_k = P_k + I_k$

---

## 5. 급여 실수령액 및 시급/주휴수당 계산기

### 5.1 개요
- 기본 시급과 주당 근무시간을 기반으로 주휴수당 포함 월급을 산출하거나, 연봉/월급 기준 4대 보험 및 근로소득세(간이세액표 간이 추정치)를 제하고 실수령액을 계산합니다.

### 5.2 입출력 변수 (시급/알바 모드 기준)
- **입력:**
  - `hourly_wage`: 기본 시급 (2026년 최저임금 반영 등)
  - `weekly_hours`: 주당 정규 근무시간
  - `tax_rate`: 세금 공제율 (예: 3.3% 프리랜서 원천징수, 4대보험 미가입 등)
- **출력:**
  - `holiday_allowance_hours`: 주휴수당 인정 시간
  - `total_monthly_wage`: 세전 월 급여
  - `net_monthly_wage`: 세후 실수령액

### 5.3 계산 공식
- **주휴수당 조건:** $\text{weekly\_hours} \ge 15$
  $$\text{holiday\_hours\_per\_week} = \min\left( \frac{\text{weekly\_hours}}{40} \times 8, 8 \right)$$
- **월 환산 시간 (월평균 주수 $4.345주 = \frac{365}{7 \times 12}$):**
  $$\text{monthly\_paid\_hours} = (\text{weekly\_hours} + \text{holiday\_hours\_per\_week}) \times \frac{365 / 7}{12} \approx (\text{weekly\_hours} + \text{holiday\_hours}) \times 4.345$$
- **세전 급여:**
  $$\text{Gross Wage} = \text{monthly\_paid\_hours} \times \text{hourly_wage}$$

---

## 6. 할인율 및 역할인 계산기

### 6.1 개요
원가와 할인율을 통한 최종 결제 금액 산출, 추가 쿠폰(중복 할인) 적용, 또는 판매가를 보고 실제 할인율(역할인)을 역산합니다.

### 6.2 입출력 변수
- **입력 (기본 할인 모드):**
  - `original_price` (실수): 정상가
  - `discount_rates` (배열): `[discount_percent_1, discount_percent_2, ...]` (순차 할인)
  - `coupon_amount` (실수): 정액 할인 쿠폰 (옵션)
- **출력:**
  - `final_price`: 최종 결제 금액
  - `total_discount_amount`: 총 할인 금액
  - `effective_discount_rate`: 실질 복합 할인율(%)

### 6.3 계산 공식
- **다중 연속 할인:**
  $$P_1 = \text{original\_price} \times \left(1 - \frac{d_1}{100}\right)$$
  $$P_2 = P_1 \times \left(1 - \frac{d_2}{100}\right) - \text{coupon\_amount}$$
- **실질 할인율:**
  $$\text{effective\_rate} = \frac{\text{original\_price} - \text{final\_price}}{\text{original\_price}} \times 100$$

---

## 7. 날짜 및 D-Day / 전역일 / 배란일 계산기

### 7.1 개요
두 날짜 간의 일수(D-Day), 특정 일수 후의 날짜(+N일 계산), 또는 영업일(주말 제외) 기준 일수를 계산합니다.

### 7.2 입출력 변수
- **입력:**
  - `mode`: `"dday"`(기준일까지 남은 날짜), `"add_days"`(N일 뒤 날짜), `"business_days"`(영업일 수)
  - `start_date`: 시작일 (`YYYY-MM-DD`)
  - `target_date` 또는 `days_to_add`
- **출력:**
  - `diff_days`: 총 차이 일수
  - `result_date`: 연산된 결과 날짜

### 7.3 계산 규칙
- **UTC 자정(Midnight) 기준 밀리초 차이 연산:**
  $$\Delta t = \text{Date.UTC}(Y_2, M_2, D_2) - \text{Date.UTC}(Y_1, M_1, D_1)$$
  $$\text{diff\_days} = \frac{\Delta t}{1000 \times 60 \times 60 \times 24}$$
- **영업일 계산 알고리즘:**
  시작일부터 종료일까지 루프를 돌며 요일 인덱스(`DayOfWeek`)가 0(일요일) 또는 6(토요일)인 날을 카운트에서 제외 ($1 \le \text{day} \le 5$인 날만 누적).

---

## 8. 체질량지수(BMI) 및 기초대사량(BMR) 계산기

### 8.1 개요
신장, 체중, 성별, 연령을 기반으로 비만도 지수(BMI)와 일상 생명 유지에 필요한 최소 에너지량(BMR, 미플린-세인트 지어 공식 권장)을 계산합니다.

### 8.2 입출력 변수
- **입력:**
  - `height_cm` (실수): 키 (cm)
  - `weight_kg` (실수): 체중 (kg)
  - `age` (정수): 만 나이
  - `gender`: `"male"` 또는 `"female"`
- **출력:**
  - `bmi` (실수, 소수점 1자리): 체질량 지수
  - `bmi_status`: 비만 단계 (대한비만학회 기준: 저체중 < 18.5, 정상 18.5~22.9, 비만전단계 23~24.9, 1단계비만 25~29.9, 2단계비만 30~34.9, 3단계비만 $\ge$ 35)
  - `bmr_kcal` (정수): 기초대사량 (kcal)

### 8.3 계산 공식
- **BMI (신장 단위 m 환산 필요):**
  $$h_m = \frac{\text{height\_cm}}{100}$$
  $$\text{BMI} = \frac{\text{weight\_kg}}{h_m^2}$$
- **기초대사량 (Mifflin-St Jeor Equation):**
  $$\text{BMR} = 10 \times \text{weight\_kg} + 6.25 \times \text{height\_cm} - 5 \times \text{age} + s$$
  - 남성: $s = +5$
  - 여성: $s = -161$

---

## 9. 자동차 유류비 및 연비 계산기

### 9.1 개요
주행거리, 차량 연비, 유류 단가를 입력하여 편도/왕복 이동 시 소요되는 예상 기름값과 1인당 카풀 비용을 산출합니다.

### 9.2 입출력 변수
- **입력:**
  - `distance_km` (실수): 이동 거리 (km)
  - `fuel_efficiency` (실수): 차량 공인 또는 실연비 (km/L)
  - `fuel_price_per_liter` (정수/실수): 리터당 유가 (원)
  - `trip_type`: `"one_way"`(편도, 배수 1) 또는 `"round_trip"`(왕복, 배수 2)
  - `passengers` (정수, 옵션): 탑승 인원
- **출력:**
  - `required_liters` (실수): 필요 연료량 (L)
  - `total_fuel_cost` (정수): 총 유류비
  - `cost_per_passenger` (정수): 1인당 분담 유류비

### 9.3 계산 공식
- **유효 거리:**
  $$\text{total\_distance} = \text{distance\_km} \times (\text{trip\_type} == \text{"round\_trip"} \ ? \ 2 : 1)$$
- **소모 유량:**
  $$\text{required\_liters} = \frac{\text{total\_distance}}{\text{fuel\_efficiency}}$$
- **총 유류비:**
  $$\text{total\_fuel\_cost} = \lfloor \text{required\_liters} \times \text{fuel\_price\_per\_liter} \rfloor$$
- **1인당 비용:**
  $$\text{cost\_per\_passenger} = \left\lceil \frac{\text{total\_fuel\_cost}}{\text{passengers}} \right\rceil$$

---

## 10. 부동산 중개보수(복비) 및 취득세 간이 계산기

### 10.1 개요
거래 유형(매매/전세/월세)과 매물 종류(주택, 오피스텔 등) 및 거래 대금에 따른 법정 최대 중개수수료율과 상한액을 계산합니다.

### 10.2 입출력 변수
- **입력:**
  - `property_type`: `"housing"`(주택), `"officetel"`(오피스텔), `"general"`(토지/상가 등)
  - `deal_type`: `"buy"`(매매/교환), `"rent"`(전세), `"monthly_rent"`(월세)
  - `deal_amount` (정수): 거래금액 (월세의 경우 `deposit`과 `monthly_pay` 분리)
- **출력:**
  - `calculated_deal_amount`: 산정 거래금액 (월세 환산보증금 적용)
  - `applied_rate`: 적용 요율 (%)
  - `max_brokerage_fee`: 중개보수 상한액 (부가세 10% 제외)
  - `vat`: 부가가치세 (10%)

### 10.3 계산 공식 (월세 환산보증금 및 주택 매매 요율 예시)
1. **월세 환산보증금 공식:**
   - 1차 산정: $\text{deal\_amount} = \text{deposit} + (\text{monthly\_pay} \times 100)$
   - 단, 1차 산정액이 5,000만 원 미만일 경우 재산정:
     $$\text{deal\_amount} = \text{deposit} + (\text{monthly\_pay} \times 70)$$
2. **주택 매매 기준 상한요율 체계 (공인중개사법 시행규칙 기준):**
   - 5천만 원 미만: $0.6\%$ (한도액 25만 원)
   - 5천만 원 이상 ~ 2억 원 미만: $0.5\%$ (한도액 80만 원)
   - 2억 원 이상 ~ 9억 원 미만: $0.4\%$ (한도 없음)
   - 9억 원 이상 ~ 12억 원 미만: $0.5\%$
   - 12억 원 이상 ~ 15억 원 미만: $0.6\%$
   - 15억 원 이상: $0.7\%$
3. **수수료 도출:**
   $$\text{raw\_fee} = \text{deal\_amount} \times \left( \frac{\text{applied\_rate}}{100} \right)$$
   $$\text{max\_brokerage\_fee} = \min(\text{raw\_fee}, \text{한도액})$$

---

## 💡 AI 코딩 에이전트 개발 지침 (Implementation Notes)

1. **부동소수점 오차 방지:**
   - 화폐 계산 및 백분율 연산 시 자바스크립트의 `0.1 + 0.2 !== 0.3` 문제를 피하기 위해 원 단위 절사 전까지는 `Math.round((value + Number.EPSILON) * 100) / 100`을 적용하거나 `decimal.js` / `big.js` 라이브러리를 활용하십시오.
2. **모듈화 구조 (Clean Architecture):**
   - 각 계산 로직은 UI와 결합하지 말고 순수 함수(Pure Function) 형태의 `/services/calculators/` 모듈로 분리하여 단위 테스트(`unit test`) 작성이 가능하도록 구현하십시오.
3. **반응형 상태 관리:**
   - 모든 입력 필드에는 실시간 포맷팅(예: `1,000,000` 단위의 3자리 콤마 처리)과 디바운싱(`debouncing`)을 적용하여 UX를 극대화하십시오.
