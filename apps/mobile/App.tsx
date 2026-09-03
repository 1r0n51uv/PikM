import { SafeAreaView, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-semibold">PikM</Text>
        <Text className="mt-2 text-center text-gray-500">
          Modulo Palestra in costruzione. Vedi docs/adr per le decisioni di
          architettura (offline-first, HealthKit, Watch).
        </Text>
      </View>
    </SafeAreaView>
  );
}
